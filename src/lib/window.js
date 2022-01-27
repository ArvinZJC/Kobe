/*
 * @Description: the window builder
 * @Version: 1.0.0.20220127
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 06:39:55
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-27 17:31:23
 */

import { app, BrowserWindow, nativeTheme, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

import * as zhCN from "../locales/zh-CN.json";
import global from "./global.js";
import { setAppMenu, setContextMenu } from "./menu.js";

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
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#000" : "#FFF",
    center: true,
    minHeight: global.common.WIN_HEIGHT_MIN,
    minWidth: global.common.WIN_WIDTH_MIN,
    title: app.name,
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
    win.loadURL(path.join(process.env.WEBPACK_DEV_SERVER_URL, startPath)); // Load the url of the dev server if in the dev mode.
  } else {
    createProtocol(global.common.APP_SCHEME);
    win.loadURL(`${global.common.APP_SCHEME}://./index.html${startPath}`); // Load the index.html if not in the dev mode.
  } // end if...else

  return win;
} // end function createWin

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
