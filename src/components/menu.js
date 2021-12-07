/*
 * @Description: the menu component
 * @Version: 1.0.0.20211207
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 16:14:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-07 00:08:48
 */

import { app, Menu, shell } from "electron";

/**
 * Update the app menu.
 * @param {boolean} isDev a flag indicating if the app is in dev mode.
 */
export function updateAppMenu(isDev) {
  var submenu_help = [
    {
      label: "Release Notes",
      click: async () => {
        await shell.openExternal("https://github.com/ArvinZJC/Kobe/releases");
      },
    },
  ];

  if (isDev) {
    submenu_help.push({ type: "separator" }, { role: "toggleDevTools" }); // Enable the browser dev tools in dev mode.
  } // end if

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      role: "window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" },
        { type: "separator" },
        { role: "window" },
      ],
    },
    {
      role: "help",
      submenu: submenu_help,
    },
  ]);

  Menu.setApplicationMenu(menu);
} // end function updateAppMenu
