/*
 * @Description: the script customising the app and context menu
 * @Version: 1.0.0.20220112
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 16:14:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-12 23:42:35
 */

import { app, Menu, shell } from "electron";
import contextMenu from "electron-context-menu";

import * as zhCN from "../locales/zh-CN.json";

/**
 * Set the app menu.
 * @param {boolean} isDev a flag indicating if the app is in dev mode.
 */
export function setAppMenu(isDev) {
  var submenu_view = [
    { role: "reload" },
    { role: "forceReload" },
    { type: "separator" },
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { type: "separator" },
    { role: "togglefullscreen" },
  ];

  // Show the browser dev tool menu item in dev mode.
  if (isDev) {
    submenu_view.push({ type: "separator" }, { role: "toggleDevTools" });
  } // end if

  // TODO: need to translate into zh-CN completely
  const menu = Menu.buildFromTemplate([
    { label: app.name, role: "appMenu" },
    { label: zhCN.default.fileMenu, role: "fileMenu" },
    { label: zhCN.default.editMenu, role: "editMenu" },
    { label: zhCN.default.viewMenu, role: "viewMenu", submenu: submenu_view },
    { label: zhCN.default.windowMenu, role: "windowMenu" },
    {
      label: zhCN.default.help,
      role: "help",
      submenu: [
        {
          label: zhCN.default.releaseNotes,
          click: async () => {
            await shell.openExternal(
              "https://github.com/ArvinZJC/Kobe/releases"
            );
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
} // end function setAppMenu

/**
 * Set the context menu.
 * @param {boolean} isDev a flag indicating if the app is in dev mode.
 * @param {BrowserWindow} win
 */
export function setContextMenu(isDev, win) {
  console.log(isDev);
  contextMenu({
    append: (defaultActions, parameters) => [
      {
        click: () => {
          shell.openExternal(
            `https://www.baidu.com/s?wd=${encodeURIComponent(
              parameters.selectionText
            )}`
          );
        },
        label: `${zhCN.default.searchWithBaidu}“{selection}”`,
        visible: parameters.selectionText.trim().length > 0,
      },
    ], // TODO: Baidu or Google as per user preferences.
    labels: {
      copy: zhCN.default.copy,
      copyLink: zhCN.default.copyLink,
      cut: zhCN.default.cut,
      inspect: zhCN.default.inspect,
      learnSpelling: zhCN.default.learnSpelling,
      lookUpSelection: `${zhCN.default.lookUp}“{selection}”`,
      paste: zhCN.default.paste,
      searchWithGoogle: `${zhCN.default.searchWithGoogle}“{selection}”`,
    },
    showCopyImage: false,
    showSearchWithGoogle: false, // TODO: Baidu or Google as per user preferences.
    window: win,
  });
}
