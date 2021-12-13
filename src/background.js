/*
 * @Description: the app's entry point
 * @Version: 1.0.0.20211213
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-13 19:35:18
 */

import { app, BrowserWindow, ipcMain, protocol, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

import {
  APP_SCHEME,
  DEV,
  GET_APP_NAME,
  IPC_RECEIVE,
  IPC_SEND,
  MACOS,
  WIN_HEIGHT_MIN,
  WIN_WIDTH_MIN,
  WINDOWS,
} from "./lib/constants.js";
import { updateAppMenu } from "./lib/menu.js";

const isDev = process.env.NODE_ENV === DEV;
const path = require("path");
var win; // The browser window.

/**
 * Create the browser window.
 * @param {number} height : an integer indicating the window height;
 * @param {number} width : an integer indicating the window width
 */
async function createWindow(height, width) {
  win = new BrowserWindow({
    center: true,
    height,
    minHeight: WIN_HEIGHT_MIN,
    minWidth: WIN_WIDTH_MIN,
    title: app.name,
    webPreferences: {
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: isDev,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      preload: path.join(__dirname, "preload.js"),
    },
    width,
  });

  updateAppMenu(isDev);
  win.setMenuBarVisibility(false); // Hide the menu bar on Windows but keep the browser dev tools in dev mode.

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL); // Load the url of the dev server if in dev mode.
  } else {
    createProtocol(APP_SCHEME);
    win.loadURL(`${APP_SCHEME}://./index.html`); // Load the index.html if not in dev mode.
  } // end if...else
} // end function createWindow

protocol.registerSchemesAsPrivileged([
  { scheme: APP_SCHEME, privileges: { secure: true, standard: true } },
]); // Scheme must be registered before the app is ready.

app.whenReady().then(async () => {
  if (isDev && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS); // Install Vue 3 Devtools.
    } catch (e) {
      console.error("Failed to install Vue 3 Devtools:", e.toString());
    } // end try...catch
  } // end if

  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = Math.round(height * 0.7);
  const windowWidth = Math.round(width * 0.7);

  createWindow(windowHeight, windowWidth);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(windowHeight, windowWidth); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
    } // end if
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== MACOS) {
    app.quit(); // Quit when all windows are closed, except on macOS where the user quits the app explicitly with command + Q.
  } // end if
});

// Exit cleanly on request from parent process in dev mode.
if (isDev) {
  if (process.platform === WINDOWS) {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      } // end if
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  } // end if...else
} // end if

ipcMain.on(IPC_SEND, (event, data) => {
  if (data === GET_APP_NAME) {
    win.webContents.send(IPC_RECEIVE, app.name);
  } // end if
});
