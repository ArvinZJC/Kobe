/*
 * @Description: the app and context menu builder
 * @Version: 2.0.2.20220226
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 16:14:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-26 23:42:45
 */

import { app, Menu, shell } from "electron";
import contextMenu from "electron-context-menu";
import settings from "electron-settings";
import { platform } from "process";

import global from "./global.js";
import { updateManually } from "./updater.js";
import { showPreferenceTabItem } from "./window.js";
import * as zhCN from "../locales/zh-CN.json";

const menuItemAboutAndCheckForUpdatesTemplates = [
  {
    label: `${zhCN.default.about}${app.name}`,
    role: "about",
  },
  ...(process.env.WEBPACK_DEV_SERVER_URL == null
    ? [
        {
          click: (menuItem) => {
            updateManually(menuItem);
          },
          label: zhCN.default.checkForUpdates,
        },
      ]
    : []),
];
const menuItemCloseTemplate = {
  label:
    platform === global.common.MACOS
      ? zhCN.default.closeWin
      : `${zhCN.default.close}${app.name}`,
  role: "close",
};
const menuItemSeparatorTemplate = { type: global.common.SEPARATOR };

/**
 * Get the initial app menu template.
 * Most accelerators are needed to specify to show on the app menu on Windows.
 * Reference: https://github.com/electron/electron/blob/main/lib/browser/api/menu-item-roles.ts
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the initial app menu template.
 */
export function getInitialAppMenuTemplate(tabbedWin) {
  return [
    ...getMenuAppTemplate(tabbedWin),
    ...getMenuFileTemplate(),
    ...getMenuEditTemplate(tabbedWin),
    ...getMenuViewTemplate(tabbedWin),
    ...getMenuWindowTemplate(),
    ...getMenuHelpTemplate(tabbedWin),
  ]; // NOTE: check the tabbed window's enter-full-screen event listener when any changes to this function and its related functions occur.
} // end function getInitialAppMenuTemplate

/**
 * Get the template of the app section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the app section in the app menu.
 */
function getMenuAppTemplate(tabbedWin) {
  if (platform === global.common.MACOS) {
    return [
      {
        label: app.name,
        role: "appMenu",
        submenu: [
          ...menuItemAboutAndCheckForUpdatesTemplates,
          menuItemSeparatorTemplate,
          {
            accelerator: "CommandOrControl+,",
            click: () => {
              showPreferenceTabItem(tabbedWin);
            },
            label: zhCN.default.preferences,
          },
          menuItemSeparatorTemplate,
          { label: zhCN.default.services, role: "services" },
          menuItemSeparatorTemplate,
          { label: `${zhCN.default.hide}${app.name}`, role: "hide" },
          { label: zhCN.default.hideOthers, role: "hideOthers" },
          { label: zhCN.default.showAll, role: "unhide" },
          menuItemSeparatorTemplate,
          { label: `${zhCN.default.quit}${app.name}`, role: "quit" },
        ],
      },
    ];
  } // end if

  return [];
} // end function getMenuAppTemplate

/**
 * Get the template of the edit section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the edit section in the app menu.
 */
function getMenuEditTemplate(tabbedWin) {
  const menuItemDeleteTemplate = {
    click: () => {
      tabbedWin.currentWebContents.delete();
    },
    label: zhCN.default.delete,
  };
  const menuItemSelectAllTemplate = {
    accelerator: "CommandOrControl+A",
    click: () => {
      tabbedWin.currentWebContents.selectAll();
    },
    label: zhCN.default.selectAll,
  };
  const menuEditTemplate = {
    label: zhCN.default.editMenu,
    role: "editMenu",
    submenu: [
      {
        accelerator: "CommandOrControl+Z",
        click: () => {
          tabbedWin.currentWebContents.undo();
        },
        label: zhCN.default.undo,
      },
      {
        accelerator:
          platform === global.common.MACOS
            ? "Shift+CommandOrControl+Z"
            : "Control+Y",
        click: () => {
          tabbedWin.currentWebContents.redo();
        },
        label: zhCN.default.redo,
      },
      menuItemSeparatorTemplate,
      {
        accelerator: "CommandOrControl+X",
        click: () => {
          tabbedWin.currentWebContents.cut();
        },
        label: zhCN.default.cut,
        registerAccelerator: false,
      },
      {
        accelerator: "CommandOrControl+C",
        click: () => {
          tabbedWin.currentWebContents.copy();
        },
        label: zhCN.default.copy,
        registerAccelerator: false,
      },
      {
        accelerator: "CommandOrControl+V",
        click: () => {
          tabbedWin.currentWebContents.paste();
        },
        label: zhCN.default.paste,
        registerAccelerator: false,
      },
      ...(platform === global.common.MACOS
        ? [
            {
              accelerator: "Cmd+Option+Shift+V",
              click: () => {
                tabbedWin.currentWebContents.pasteAndMatchStyle();
              },
              label: zhCN.default.pasteAndMatchStyle,
              registerAccelerator: false,
            },
            menuItemDeleteTemplate,
            menuItemSelectAllTemplate,
            menuItemSeparatorTemplate,
            {
              label: zhCN.default.speech,
              submenu: [
                { label: zhCN.default.startSpeaking, role: "startSpeaking" },
                { label: zhCN.default.stopSpeaking, role: "stopSpeaking" },
              ],
            },
          ]
        : [
            menuItemDeleteTemplate,
            menuItemSeparatorTemplate,
            menuItemSelectAllTemplate,
          ]),
    ],
  };

  if (platform === global.common.MACOS) {
    return [menuEditTemplate];
  } // end if

  return [menuEditTemplate, menuItemSeparatorTemplate];
} // end function getMenuEditTemplate

/**
 * Get the template of the file section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the file section in the app menu.
 */
function getMenuFileTemplate() {
  if (platform === global.common.MACOS) {
    return [
      {
        label: zhCN.default.fileMenu,
        role: "fileMenu",
        submenu: [menuItemCloseTemplate],
      },
    ];
  } // end if

  return [];
} // end function getMenuFileTemplate

/**
 * Get the template of the help section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the help section in the app menu.
 */
function getMenuHelpTemplate(tabbedWin) {
  const menuHelpTemplate = {
    label: zhCN.default.help,
    role: "help",
    submenu: [
      {
        enabled: false,
        label: `${app.name}${zhCN.default.website}`,
      },
      {
        enabled: false,
        label: zhCN.default.userManual,
      },
      menuItemSeparatorTemplate,
      {
        click: async () => {
          await shell.openExternal("https://github.com/ArvinZJC/Kobe");
        },
        label: `GitHub ${zhCN.default.repo}`,
      },
      {
        click: async () => {
          await shell.openExternal("https://gitee.com/ArvinZJC/Kobe");
        },
        label: `Gitee ${zhCN.default.repo}（${zhCN.default.backup}）`,
      },
      {
        click: async () => {
          await shell.openExternal("https://github.com/ArvinZJC/Kobe/issues");
        },
        label: zhCN.default.viewIssues,
      },
      {
        click: async () => {
          await shell.openExternal("https://github.com/ArvinZJC/Kobe/releases");
        },
        label: zhCN.default.releaseNotes,
      },
      menuItemSeparatorTemplate,
      ...(platform === global.common.WINDOWS
        ? menuItemAboutAndCheckForUpdatesTemplates
        : []),
      ...(process.env.NODE_ENV === global.common.DEV
        ? [
            menuItemSeparatorTemplate,
            {
              click: () => {
                tabbedWin.controlView.webContents.isDevToolsOpened()
                  ? tabbedWin.controlView.webContents.closeDevTools()
                  : tabbedWin.controlView.webContents.openDevTools({
                      mode: "detach",
                    });
              },
              label: "Toggle Tab Bar's Dev Tools",
            },
            {
              accelerator:
                platform === global.common.MACOS
                  ? "Alt+Command+I"
                  : "Ctrl+Shift+I",
              click: () => {
                tabbedWin.currentWebContents.toggleDevTools();
              },
              label: "Toggle Active Tab's Dev Tools",
              nonNativeMacOSRole: true,
            },
          ]
        : []),
    ],
  };

  if (platform === global.common.MACOS) {
    return [menuHelpTemplate];
  } // end if

  return [
    {
      accelerator: "CommandOrControl+,",
      click: () => {
        showPreferenceTabItem(tabbedWin);
      },
      label: zhCN.default.preferences,
    },
    menuHelpTemplate,
    menuItemSeparatorTemplate,
    menuItemCloseTemplate,
  ];
} // end function getMenuHelpTemplate

/**
 * Get the template of the view section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the view section in the app menu.
 */
function getMenuViewTemplate(tabbedWin) {
  const menuViewSubmenuTemplate = [
    {
      accelerator: "CmdOrCtrl+R",
      click: () => {
        tabbedWin.currentWebContents.reload();
      },
      label: zhCN.default.reload,
      nonNativeMacOSRole: true,
    },
    {
      accelerator: "Shift+CmdOrCtrl+R",
      click: () => {
        tabbedWin.currentWebContents.reloadIgnoringCache();
      },
      label: zhCN.default.forceReload,
      nonNativeMacOSRole: true,
    },
    menuItemSeparatorTemplate,
    {
      accelerator:
        platform === global.common.MACOS ? "Control+Command+F" : "F11",
      click: () => {
        tabbedWin.win.setFullScreen(!tabbedWin.win.isFullScreen());
      },
      label: `${zhCN.default.enter}${zhCN.default.fullScreen}`,
    },
    menuItemSeparatorTemplate, // Required for Windows.
  ];

  if (platform === global.common.MACOS) {
    return [
      {
        label: zhCN.default.viewMenu,
        role: "viewMenu",
        submenu: menuViewSubmenuTemplate,
      },
    ];
  } // end if

  return menuViewSubmenuTemplate;
} // end function getMenuViewTemplate

/**
 * Get the template of the window section in the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 * @returns the template of the window section in the app menu.
 */
function getMenuWindowTemplate() {
  if (platform === global.common.MACOS) {
    return [
      {
        label: zhCN.default.windowMenu,
        role: "windowMenu",
        submenu: [
          {
            accelerator: "CommandOrControl+M",
            label: zhCN.default.minimise,
            role: "minimize",
          },
          { label: zhCN.default.zoom, role: "zoom" },
          menuItemSeparatorTemplate,
          { label: zhCN.default.bringAllToFront, role: "front" },
        ],
      },
    ];
  } // end if

  return [];
} // end function getMenuWindowTemplate

/**
 * Set the app menu.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 */
export function setAppMenu(tabbedWin) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(getInitialAppMenuTemplate(tabbedWin))
  );
} // end function setAppMenu

/**
 * Set the context menu.
 *
 * Reference: https://github.com/sindresorhus/electron-context-menu/blob/main/index.js
 * @param {BrowserView} view the tab view owning the context menu.
 */
export async function setContextMenu(view) {
  const externalSearch = await settings.get(global.common.EXTERNAL_SEARCH_KEY);
  const showSearchWithBaidu = externalSearch === global.common.BAIDU_ID;

  contextMenu({
    menu: (actions, params, currentWin, dictionarySuggestions) => [
      dictionarySuggestions.length > 0 && actions.separator(),
      ...dictionarySuggestions,
      actions.separator(),
      actions.learnSpelling(),
      actions.separator(),
      actions.lookUpSelection(),
      actions.separator(),
      showSearchWithBaidu && {
        click: async () => {
          await shell.openExternal(
            `https://www.baidu.com/s?wd=${encodeURIComponent(
              params.selectionText
            )}`
          );
        },
        label: `${zhCN.default.use}${zhCN.default.baidu}${zhCN.default.search}“{selection}”`,
        visible: params.selectionText.trim().length > 0,
      },
      !showSearchWithBaidu && actions.searchWithGoogle(),
      actions.separator(),
      {
        accelerator: "CommandOrControl+Z",
        click: () => view.webContents.undo(),
        enabled: params.editFlags.canUndo,
        visible: params.isEditable,
        label: zhCN.default.undo,
      },
      {
        accelerator:
          platform === global.common.MACOS
            ? "Shift+CommandOrControl+Z"
            : "Control+Y",
        click: () => view.webContents.redo(),
        enabled: params.editFlags.canRedo,
        visible: params.isEditable,
        label: zhCN.default.redo,
      },
      actions.separator(),
      actions.copyLink(),
      actions.separator(),
      {
        accelerator: "CommandOrControl+X",
        click: () => view.webContents.cut(),
        enabled: params.editFlags.canCut,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.cut,
      },
      {
        accelerator: "CommandOrControl+C",
        click: () => view.webContents.copy(),
        enabled: params.editFlags.canCopy,
        registerAccelerator: false,
        visible: params.isEditable || params.selectionText.length > 0,
        label: zhCN.default.copy,
      },
      {
        accelerator: "CommandOrControl+V",
        click: () => view.webContents.paste(),
        enabled: params.editFlags.canPaste,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.paste,
      },
      platform === global.common.MACOS && {
        accelerator: "Cmd+Option+Shift+V",
        click: () => view.webContents.pasteAndMatchStyle(),
        enabled: params.editFlags.canPaste,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.pasteAndMatchStyle,
      },
      {
        click: () => view.webContents.delete(),
        enabled: params.editFlags.canDelete,
        visible: params.isEditable,
        label: zhCN.default.delete,
      },
      {
        accelerator: "CommandOrControl+A",
        click: () => view.webContents.selectAll(),
        enabled: params.editFlags.canSelectAll,
        visible: params.isEditable || params.selectionText.length > 0,
        label: zhCN.default.selectAll,
      },
      actions.separator(),
      {
        accelerator: "CmdOrCtrl+R",
        click: () => view.webContents.reload(),
        label: zhCN.default.reload,
      },
      {
        accelerator: "Shift+CmdOrCtrl+R",
        click: () => view.webContents.reloadIgnoringCache(),
        label: zhCN.default.forceReload,
      },
      ...(process.env.NODE_ENV === global.common.DEV
        ? [
            actions.separator(),
            {
              click: () => {
                view.webContents.inspectElement(params.x, params.y);

                if (view.webContents.isDevToolsOpened()) {
                  view.webContents.devToolsWebContents.focus();
                } // end if
              },
              label: "Inspect Element",
            },
          ]
        : []),
    ],
    labels: {
      copy: zhCN.default.copy,
      copyLink: zhCN.default.copyLink,
      cut: zhCN.default.cut,
      learnSpelling: zhCN.default.learnSpelling,
      lookUpSelection: `${zhCN.default.lookUp}“{selection}”`,
      paste: zhCN.default.paste,
      searchWithGoogle: `${zhCN.default.use}${zhCN.default.google}${zhCN.default.search}“{selection}”`,
    },
    window: view,
  });
} // end function setContextMenu
