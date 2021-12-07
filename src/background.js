/*
 * @Description: the app's entry point
 * @Version: 1.0.0.20211207
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-07 00:09:22
 */

"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

import { updateAppMenu } from "./components/menu.js";

const isDev = process.env.NODE_ENV === "development";

/**
 * Create the browser window.
 */
async function createWindow() {
  const win = new BrowserWindow({
    height: 600,
    title: app.name,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
    width: 800,
  });

  updateAppMenu(isDev);
  win.setMenuBarVisibility(false); // Hide the menu bar on Windows but keep the browser dev tools in dev mode.

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL); // Load the url of the dev server if in dev mode.
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html"); // Load the index.html if not in dev mode.
  } // end if...else
} // end function createWindow

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]); // Scheme must be registered before the app is ready.
app.whenReady().then(async () => {
  if (isDev && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS); // Install Vue 3 Devtools.
    } catch (e) {
      console.error("Failed to install Vue 3 Devtools:", e.toString());
    } // end try...catch
  } // end if

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
    } // end if
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit(); // Quit when all windows are closed, except on macOS where the user quits the app explicitly with command + Q.
  } // end if
});

// Exit cleanly on request from parent process in dev mode.
if (isDev) {
  if (process.platform === "win32") {
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
