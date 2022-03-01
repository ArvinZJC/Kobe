/*
 * @Description: the tabbed window builder
 * @Version: 1.1.0.20220301
 * @Author: Arvin Zhao
 * @Date: 2022-02-19 21:02:04
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-01 22:40:43
 */

// The tabbed window builder is inspired by electron-as-browser (https://github.com/hulufei/electron-as-browser, Commit 23eec2e1f4db09a6786313a5ca2a4a3700791cb3). Most of the builder's APIs are almost the same as those of electron-as-browser (https://hulufei.github.io/electron-as-browser/#browserlikewindow). However, the control view is rendered on the browser window rather than a separate browser view to take advantage of the Windows Controls Overlay APIs (https://github.com/WICG/window-controls-overlay/blob/main/explainer.md).
import { BrowserWindow, BrowserView, ipcMain, ipcRenderer } from "electron";
import log from "electron-log";
import EventEmitter from "events";

import { setContextMenu } from "./menu.js";
import { updateAutomatically } from "./updater.js";

const path = require("path");

log.transports.file.level = global.common.MIN_LOG_LEVEL;

/**
 * @typedef {number} TabID
 * @description BrowserView's ID as the tab ID.
 */

/**
 * @typedef {object} Tab
 * @property {string} url the tab's url (the address bar).
 * @property {string} href the tab's loaded page url (location.href).
 * @property {string} title the tab's title.
 * @property {string} favicon the tab's favicon url.
 * @property {boolean} isLoading
 * @property {boolean} canGoBack
 * @property {boolean} canGoForward
 */

/**
 * @typedef {Object.<TabID, Tab>} Tabs
 */

/**
 * @typedef {object} Bounds
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

export class TabbedWindow extends EventEmitter {
  /**
   * The constructor for defining a tabbed window.
   * @param {object} options the options for building a tabbed window.
   * @param {string} [options.blankPage = ''] the blank page to load on new tab.
   * @param {string} options.blankTitle the blank page's title.
   * @param {number} options.controlHeight the control interface's height.
   * @param {string} options.controlPanel the control interface path to load.
   * @param {object} [options.controlReferences] the additional web peferences for the control panel view.
   * @param {boolean} [options.debug] toggle debug.
   * @param {number} options.height the tabbed window's height.
   * @param {function} [options.onNewWindow] - the custom web content `new-window` event handler.
   * @param {string} [options.startPage = ''] the start page to load on the tabbed window open.
   * @param {object} [options.viewReferences] the additional web preferences for every tab view.
   * @param {number} options.width the tabbed window's width.
   * @param {object} [options.winOptions] the tabbed window options.
   */
  constructor(options) {
    super();
    this.options = options;

    const {
      controlPanel,
      controlReferences,
      height,
      width,
      winOptions = {},
    } = options;

    this.commonWebPreferences = {
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: this.options.debug,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      preload: path.join(__dirname, "preload.js"),
      sandbox: true, // Support window.opener. See https://github.com/electron/electron/issues/1865#issuecomment-249989894 for more info.
    };
    this.defCurrentViewId = null;
    this.defTabConfigs = {};
    this.ipc = null; // IPC channel.
    this.tabs = []; // Keep order.
    this.views = {}; // Prevent browser views garbage collected.
    this.win = new BrowserWindow({
      ...winOptions,
      height,
      show: false,
      width,
      webPreferences: {
        ...this.commonWebPreferences,
        ...controlReferences, // Put it here to overwrite existing values in the above properties.
      },
    });
    this.win.loadURL(controlPanel);
    this.setChannel();
  } // end constructor

  /**
   * The current tab view.
   */
  get currentView() {
    return this.currentViewId ? this.views[this.currentViewId] : null;
  }

  /**
   * The current tab view ID.
   */
  get currentViewId() {
    return this.defCurrentViewId;
  }

  set currentViewId(id) {
    this.defCurrentViewId = id;
    this.setContentBounds();

    if (this.ipc) {
      this.ipc.reply("active-update", id);
    } // end if
  }

  /**
   * The current tab view's web contents.
   */
  get currentWebContents() {
    const { webContents } = this.currentView || {};
    return webContents;
  }

  /**
   * The tab configurations.
   */
  get tabConfigs() {
    return this.defTabConfigs;
  }

  set tabConfigs(v) {
    this.defTabConfigs = v;

    if (this.ipc) {
      this.ipc.reply("tabs-update", {
        confs: v,
        tabs: this.tabs,
      });
    } // end if
  }

  /**
   * Destroy the tab.
   * @param {TabID} viewId the tab view ID.
   * @ignore
   */
  destroyView(viewId) {
    const view = this.views[viewId];

    if (view) {
      view.webContents.destroy();
      this.views[viewId] = null;
    } // end if
  } // end function destoryView

  /**
   * Get the control view's bounds.
   * @returns the bounds of the control view excluding the window's frame.
   */
  getControlBounds() {
    const contentBounds = this.win.getContentBounds();
    return {
      height: this.options.controlHeight,
      width: contentBounds.width,
      x: 0,
      y: 0,
    };
  } // end function getControlBounds

  /**
   * Load the URL on the view.
   * @param {string} url the URL to load.
   * @ignore
   */
  loadURL(url) {
    const { currentView } = this;

    if (!url || !currentView) {
      return;
    } // end if

    const { id, webContents } = currentView;
    const MARKS = "__IS_INITIALIZED__";

    // Prevent addEventListeners on the same webContents when entering urls in the same tab.
    if (webContents[MARKS]) {
      webContents.loadURL(url);
      return;
    } // end if

    const onNewWindow = async (
      e,
      newUrl,
      frameName,
      disposition,
      winOptions
    ) => {
      // Handle newUrl = "about:blank" in some cases.
      if (!new URL(newUrl).host) {
        return;
      } // end if

      e.preventDefault();

      if (disposition === "new-window") {
        e.newGuest = new BrowserWindow(winOptions);
      } else if (disposition === "foreground-tab") {
        await this.newTab(newUrl, id);
        e.newGuest = new BrowserWindow({ ...winOptions, show: false }); // `newGuest` must be set to prevent freeze the trigger tab. The window will be destroyed automatically on the trigger tab closed.
      } else {
        await this.newTab(newUrl, id);
      } // end nested if...else
    };

    webContents.on("new-window", this.options.onNewWindow || onNewWindow);

    // Keep the events in order.
    webContents
      .on("did-start-loading", () => {
        this.setTabConfig(id, { isLoading: true });
      })
      .on("did-start-navigation", (e, href, isInPlace, isMainFrame) => {
        if (isMainFrame) {
          this.setTabConfig(id, { url: href, href });

          /**
           * The url-updated event.
           * @event TabbedWindow#url-updated
           * @returns the current tab view.
           * @returns the updated URL.
           */
          this.emit("url-updated", { view: currentView, href });
        } // end if
      })
      .on("will-redirect", (e, href) => {
        this.setTabConfig(id, { url: href, href });
        this.emit("url-updated", { view: currentView, href });
      })
      .on("page-title-updated", (e, title) => {
        this.setTabConfig(id, { title });
      })
      .on("page-favicon-updated", (e, favicons) => {
        this.setTabConfig(id, { favicon: favicons[0] });
      })
      .on("did-stop-loading", () => {
        this.setTabConfig(id, { isLoading: false });
      })
      .on("dom-ready", () => {
        webContents.focus();
      });

    webContents.loadURL(url);
    webContents[MARKS] = true;

    this.setContentBounds();
  } // end function loadURL

  /**
   * Create a tab.
   * @param {string} [url=this.options.blankPage] the URL to load.
   * @param {number} [appendTo] the specified tab ID to add the new tab next to the specific tab.
   * @param {object} [references=this.options.viewReferences] the custom web preferences to the new tab.
   * @fires TabbedWindow#new-tab
   */
  async newTab(url, appendTo, references) {
    const view = new BrowserView({
      webPreferences: {
        ...this.commonWebPreferences,
        ...(references || this.options.viewReferences), // Put it here to overwrite existing values in the above properties.
      },
    });

    view.id = view.webContents.id;

    if (appendTo) {
      const prevIndex = this.tabs.indexOf(appendTo);
      this.tabs.splice(prevIndex + 1, 0, view.id);
    } else {
      this.tabs.push(view.id);
    } // end if...else

    this.views[view.id] = view;

    // Add to the manager first.
    const lastView = this.currentView;

    this.setCurrentView(view.id);
    view.setAutoResize({ height: true, width: true });
    await setContextMenu(view); // Set the context menu for the new tab view.
    this.loadURL(url || this.options.blankPage);
    this.setTabConfig(view.id, {
      title: this.options.blankTitle,
    });

    /**
     * The new-tab event.
     * @event TabbedWindow#new-tab
     * @returns the current tab view.
     * @returns the loaded URL.
     * @returns the previous active view.
     */
    this.emit("new-tab", view, { openedURL: url, lastView });
    return view;
  } // end function newTab

  /**
   * Set the tabbed window event channel.
   * @ignore
   */
  setChannel() {
    const webContentsAct = (actionName) => {
      const webContents = this.currentWebContents;
      const action = webContents && webContents[actionName];
      if (typeof action === "function") {
        if (actionName === "reload" && webContents.getURL() === "") {
          return;
        } // end if
        action.call(webContents);
      } else {
        log.warn("Invalid tabbed window web content action:", actionName);
      } // end if...else
    };

    const channels = Object.entries({
      act: (e, actName) => webContentsAct(actName),
      "close-tab": async (e, id) => {
        if (id === this.currentViewId) {
          const removeIndex = this.tabs.indexOf(id);
          const nextIndex =
            removeIndex === this.tabs.length - 1 ? 0 : removeIndex + 1;
          this.setCurrentView(this.tabs[nextIndex]);
        } // end if

        this.tabs = this.tabs.filter((v) => v !== id);
        this.tabConfigs = {
          ...this.tabConfigs,
          [id]: null,
        };
        this.destroyView(id);
      },
      "control-ready": async (e) => {
        this.ipc = e;
        await this.newTab(this.options.startPage || "");
        this.win.show();
        updateAutomatically();

        /**
         * The control-ready event.
         * @event TabbedWindow#control-ready
         * @type {IpcMainEvent}
         */
        this.emit("control-ready", e);
      },
      "new-tab": async (e, url, references) => {
        await this.newTab(url, null, references);
      },
      "switch-tab": (e, id) => {
        this.switchTab(id);
      },
      "url-change": (e, url) => {
        this.setTabConfig(this.currentViewId, { url });
      },
      "url-enter": (e, url) => {
        this.loadURL(url);
      },
    });

    channels
      .map(([name, listener]) => [
        name,
        (e, ...args) => {
          // Support multiple tabbed windows.
          if (
            this.win &&
            !this.win.isDestroyed() &&
            e.sender === this.win.webContents
          ) {
            listener(e, ...args);
          } // end if
        },
      ])
      .forEach(([name, listener]) => ipcMain.on(name, listener));

    /**
     * The closed event.
     *
     * @event TabbedWindow#closed
     */
    this.win.on("closed", () => {
      channels.forEach(([name, listener]) =>
        ipcMain.removeListener(name, listener)
      ); // Remember to clear all ipcMain events as ipcMain bind on every new tabbed window instance.

      this.tabs.forEach((id) => this.destroyView(id)); // Prevent BrowserView memory leak on close.
      this.emit("closed");
    });
  } // end function setChannel

  /**
   * Set the web content view's bounds automatically.
   * @ignore
   */
  setContentBounds() {
    const [contentWidth, contentHeight] = this.win.getContentSize();
    const controlBounds = this.getControlBounds();

    if (this.currentView) {
      this.currentView.setBounds({
        height: contentHeight - controlBounds.height,
        width: contentWidth,
        x: 0,
        y: controlBounds.y + controlBounds.height,
      });
    } // end if
  } // end function setControlBounds

  /**
   * Set the current tab view.
   * @param {number} viewId the tab view ID.
   * @ignore
   */
  setCurrentView(viewId) {
    if (!viewId) {
      return;
    } // end if

    this.win.removeBrowserView(this.currentView);
    this.win.addBrowserView(this.views[viewId]);
    this.currentViewId = viewId;
    this.currentWebContents.focus();
  } // end function setCurrentView

  /**
   * Set the tab configurations.
   * @param {number} viewId the tab view ID.
   * @param {object} kv the configurations.
   * @returns the tab configurations
   * @ignore
   */
  setTabConfig(viewId, kv) {
    const tab = this.tabConfigs[viewId];
    const { webContents } = this.views[viewId] || {};
    this.tabConfigs = {
      ...this.tabConfigs,
      [viewId]: {
        ...tab,
        canGoBack: webContents && webContents.canGoBack(),
        canGoForward: webContents && webContents.canGoForward(),
        ...kv, // Put it here to overwrite existing values in the above properties.
      },
    };
    return this.tabConfigs;
  } // end function setTabConfig

  /**
   * Switch to the specified tab.
   * @param {TabID} viewId the tab view ID.
   */
  switchTab(viewId) {
    this.setCurrentView(viewId);
  } // end function switchTab
} // end class TabbedWindow

const sendAct = (actName) => ipcRenderer.send("act", actName);

/**
 * Tell the tab view URL in the address bar changed.
 * @param {string} url the tab view URL in the address bar.
 */
export const sendChangeURL = (url) => ipcRenderer.send("url-change", url);

/**
 * Tell the tab view to close the tab.
 * @param {TabID} id the tab view ID.
 */
export const sendCloseTab = (id) => ipcRenderer.send("close-tab", id);

/**
 * Tell the tab view to load the URL.
 * @param {string} url the URL to load.
 */
export const sendEnterURL = (url) => ipcRenderer.send("url-enter", url);

/**
 * Tell the tab view to go back.
 */
export const sendGoBack = () => sendAct("goBack");

/**
 * Tell the tab view to go forward.
 */
export const sendGoForward = () => sendAct("goForward");

/**
 * Create a new tab.
 * @param {string} [url] the URL to load.
 * @param {object} [references] the custom web preferences to the new tab.
 */
export const sendNewTab = (url, references) =>
  ipcRenderer.send("new-tab", url, references);

/**
 * Tell the tab view to reload.
 */
export const sendReload = () => sendAct("reload");

/**
 * Tell the tab view to stop loading.
 */
export const sendStop = () => sendAct("stop");

/**
 * Tell the tab view to switch to the specified tab.
 * @param {TabID} id the tab view ID.
 */
export const sendSwitchTab = (id) => ipcRenderer.send("switch-tab", id);
