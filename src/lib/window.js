/*
 * @Description: the window builder
 * @Version: 1.0.0.20220116
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 06:39:55
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-16 09:10:51
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
export async function addTabbedAppWin() {
  const tabbedAppWin = await createAppWin();

  if (process.platform === global.common.MACOS) {
    BrowserWindow.getFocusedWindow().addTabbedWindow(tabbedAppWin);
  } // end if
} // end function addTabbedAppWin

/**
 * Create an app window.
 */
export async function createAppWin() {
  const appWin = createWin(global.common.APP_WIN_ID, app.name);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await appWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL); // Load the url of the dev server if in dev mode.
  } else {
    createProtocol(global.common.APP_SCHEME);
    appWin.loadURL(`${global.common.APP_SCHEME}://./index.html`); // Load the index.html if not in dev mode.
  } // end if...else
} // end function createAppWin

/**
 * Create a preference window.
 */
export async function createPreferenceWin() {
  const preferenceWin = createWin(
    global.common.PREFERENCE_WIN_ID,
    zhCN.default.preferences
  );

  // TODO
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await preferenceWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL); // Load the url of the dev server if in dev mode.
  } else {
    createProtocol(global.common.APP_SCHEME);
    preferenceWin.loadURL(`${global.common.APP_SCHEME}://./index.html`); // Load the index.html if not in dev mode.
  } // end if...else
} // end function createPreferenceWin

/**
 * Create a general window.
 * @param {string} id the window ID.
 * @param {string} title the window title.
 */
function createWin(id, title) {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const winHeight = Math.round(height * 0.7);
  const winWidth = Math.round(width * 0.7);
  var winOptions = {
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#000" : "#FFF",
    center: true,
    height:
      winHeight >= global.common.WIN_HEIGHT_MIN
        ? winHeight
        : global.common.WIN_HEIGHT_MIN,
    minHeight: global.common.WIN_HEIGHT_MIN,
    minWidth: global.common.WIN_WIDTH_MIN,
    title,
    webPreferences: {
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: isDev,
      enableBlinkFeatures: "CSSColorSchemeUARendering", // See https://stackoverflow.com/a/65313951 for reference.
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      preload: path.join(__dirname, "preload.js"),
      scrollBounce: true,
    },
    width:
      winWidth >= global.common.WIN_WIDTH_MIN
        ? winWidth
        : global.common.WIN_WIDTH_MIN,
    vibrancy: "window",
  };

  if (id === global.common.APP_WIN_ID) {
    winOptions.tabbingIdentifier = global.common.APP_WIN_ID;
  } // end if

  if (id === global.common.PREFERENCE_WIN_ID) {
    winOptions.fullscreenable = false;
    winOptions.minimizable = false;
    winOptions.resizable = false;
  } // end if...else

  const win = new BrowserWindow(winOptions);

  setAppMenu(isDev);
  setContextMenu(isDev, win);
  win.setMenuBarVisibility(false); // TODO: depend on tab implementation on Windows. Hide the menu bar on Windows but keep the browser dev tools in dev mode.
  return win;
} // end function createWin
