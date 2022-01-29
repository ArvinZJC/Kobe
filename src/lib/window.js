/*
 * @Description: the window builder
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 06:39:55
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 18:53:04
 */

import { app, BrowserWindow, ipcMain, nativeTheme, screen } from "electron";
import settings from "electron-settings";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

import * as stockList from "../../extensions/StockList/StockList.json";
import * as zhCN from "../locales/zh-CN.json";
import global from "./global.js";
import { setAppMenu, setContextMenu } from "./menu.js";
import { getSearchResultData } from "./processor.js";

const isDev = process.env.NODE_ENV === global.common.DEV;
const path = require("path");

/**
 * Create a tabbed app window.
 */
export function addTabbedAppWin() {
  if (process.platform === global.common.MACOS) {
    const win = BrowserWindow.getFocusedWindow(); // It is necessary to put this line before creating a window to add the tabbed app window properly.
    const tabbedAppWin = createWin(global.common.APP_WIN_ID);

    win.addTabbedWindow(tabbedAppWin);
  } // end if
} // end function addTabbedAppWin

/**
 * Create a window.
 * @param {string} id the window ID.
 */
export function createWin(id) {
  var winOptions = {
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? global.common.DARK_WIN_COLOUR
      : global.common.LIGHT_WIN_COLOUR,
    center: true,
    minHeight: global.common.WIN_HEIGHT_MIN,
    minWidth: global.common.WIN_WIDTH_MIN,
    show: false,
    title:
      id === global.common.PREFERENCE_WIN_ID
        ? zhCN.default.preferences
        : app.name,
    webPreferences: {
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: isDev,
      enableBlinkFeatures: "CSSColorSchemeUARendering", // See https://stackoverflow.com/a/65313951 for reference.
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      preload: path.join(__dirname, "preload.js"),
      scrollBounce: true,
    },
    vibrancy: "window",
  };

  if (id === global.common.APP_WIN_ID) {
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    const winHeight = Math.round(height * 0.7);
    const winWidth = Math.round(width * 0.7);

    winOptions.height =
      winHeight >= global.common.WIN_HEIGHT_MIN
        ? winHeight
        : global.common.WIN_HEIGHT_MIN;
    winOptions.tabbingIdentifier = global.common.APP_WIN_ID;
    winOptions.width =
      winWidth >= global.common.WIN_WIDTH_MIN
        ? winWidth
        : global.common.WIN_WIDTH_MIN;
  } // end if

  if (id === global.common.PREFERENCE_WIN_ID) {
    winOptions.fullscreenable = false;
    winOptions.minimizable = false;
    winOptions.resizable = false;
  } // end if...else

  const win = new BrowserWindow(winOptions);
  const startPath =
    id === global.common.PREFERENCE_WIN_ID
      ? `/#/${global.common.PREFERENCE_VIEW}`
      : "";

  setAppMenu(isDev);
  setContextMenu(isDev, win);
  win.setMenuBarVisibility(true); // TODO: depend on tab implementation on Windows. Hide the menu bar on Windows but keep the browser dev tools in dev mode.

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${startPath}`); // Load the url of the dev server if in the dev mode.
  } else {
    createProtocol(global.common.APP_SCHEME);
    win.loadURL(`${global.common.APP_SCHEME}://./index.html${startPath}`); // Load the index.html if not in the dev mode.
  } // end if...else

  win.once("ready-to-show", () => win.show());
  return win;
} // end function createWin

/**
 * Initialise the IPC main channel listener.
 */
export function initialiseIpcMainListener() {
  Array.prototype.forEach.call(stockList.default, (element, index, array) => {
    const symbolParts = element[global.common.STOCK_SYMBOL_KEY].split("."); // Split the original value of the stock symbol key (e.g., "601006.SZ" => {"601006", "SZ"}).

    array[index][global.common.STOCK_SYMBOL_KEY] =
      symbolParts[1] + symbolParts[0];
  }); // Process the stock list data from the specific JSON file.
  ipcMain.on(global.common.IPC_SEND, async (event, data) => {
    var win = BrowserWindow.getFocusedWindow(); // Get the focused window here to better ensure that it is the window instance that emits the IPC main channel event.

    if (win == null) {
      win = BrowserWindow.getAllWindows()[0];
    } // end if

    if (typeof data === "object") {
      switch (data[global.common.TAG_KEY]) {
        case global.common.GET_SEARCH_RESULT_DATA: {
          const searchResultData = await getSearchResultData(
            data[global.common.END_DATE_KEY],
            data[global.common.START_DATE_KEY],
            data[global.common.STOCK_SYMBOL_KEY]
          );

          win.webContents.send(global.common.IPC_RECEIVE, searchResultData);
          break;
        }
        case global.common.SET_APPEARANCE: {
          await settings.set(
            global.common.APPEARANCE_KEY,
            data[global.common.APPEARANCE_KEY]
          );
          nativeTheme.themeSource = data[global.common.APPEARANCE_KEY];
          Array.prototype.forEach.call(
            BrowserWindow.getAllWindows(),
            (element) =>
              element.setBackgroundColor(
                nativeTheme.shouldUseDarkColors
                  ? global.common.DARK_WIN_COLOUR
                  : global.common.LIGHT_WIN_COLOUR
              )
          );
          break;
        }
        default: {
          console.log("Unknown IPC channel event.");
        }
      } // end switch-case
    } else {
      switch (data) {
        case global.common.GET_APP_NAME: {
          win.webContents.send(global.common.IPC_RECEIVE, app.name);
          break;
        }
        case global.common.GET_APPEARANCE: {
          var appearance = {};

          appearance[global.common.APPEARANCE_KEY] = await settings.get(
            global.common.APPEARANCE_KEY
          );
          win.webContents.send(global.common.IPC_RECEIVE, appearance);
          break;
        }
        case global.common.GET_CONTENT_SIZE: {
          win.webContents.send(global.common.IPC_RECEIVE, win.getContentSize());
          break;
        }
        case global.common.GET_EXTERNAL_SEARCH: {
          var externalSearch = {};

          externalSearch[global.common.EXTERNAL_SEARCH_KEY] =
            await settings.get(global.common.EXTERNAL_SEARCH_KEY);
          win.webContents.send(global.common.IPC_RECEIVE, externalSearch);
          break;
        }
        case global.common.GET_STOCK_LIST: {
          win.webContents.send(global.common.IPC_RECEIVE, stockList.default);
          break;
        }
        default: {
          console.log("Unknown IPC channel event.");
        }
      } // end switch-case
    } // end if...else
  });
}

/**
 * Create a preference window if it does not exist. Otherwise, focus on the existing preference window.
 */
export function showPreferenceWin() {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.title === zhCN.default.preferences) {
      win.focus();
      return;
    } // end if
  } // end for

  createWin(global.common.PREFERENCE_WIN_ID);
} // end function showPreferenceWin
