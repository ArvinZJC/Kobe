/*
 * @Description: the script customising the app menu
 * @Version: 1.0.0.20220110
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 16:14:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-10 18:52:33
 */

import { app, Menu, shell } from "electron";

import * as zhCN from "../locales/zh-CN.json";

/**
 * Update the app menu.
 * @param {boolean} isDev a flag indicating if the app is in dev mode.
 */
export function updateAppMenu(isDev) {
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
} // end function updateAppMenu
