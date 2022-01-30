/*
 * @Description: the app's entry point
 * @Version: 1.0.0.20220130
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-30 15:08:08
 */

import { app, BrowserWindow, protocol } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

import global from "./lib/global.js";
import { initialisePreferences } from "./lib/preferences.js";
import {
  addTabbedAppWin,
  createWin,
  initialiseIpcMainListener,
} from "./lib/window.js";
import * as zhCN from "./locales/zh-CN.json";

const isDev = process.env.NODE_ENV === global.common.DEV;

protocol.registerSchemesAsPrivileged([
  {
    scheme: global.common.APP_SCHEME,
    privileges: { secure: true, standard: true },
  },
]); // Scheme must be registered before the app is ready.

// Perform specific tasks when the app is ready.
app.whenReady().then(async () => {
  if (isDev && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS); // Install Vue 3 Devtools.
    } catch (e) {
      console.error("Failed to install Vue 3 Devtools:", e.toString());
    } // end try...catch
  } // end if

  await initialisePreferences();
  initialiseIpcMainListener();
  await createWin(global.common.APP_WIN_ID);

  // Emitted when the app is activated.
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWin(global.common.APP_WIN_ID); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
    } // end if
  });

  // Emitted when the user clicks the native macOS new tab button.
  app.on("new-window-for-tab", async () => {
    await addTabbedAppWin();
  });
});

// Emitted when all windows have been closed.
app.on("window-all-closed", () => {
  if (process.platform !== global.common.MACOS) {
    app.quit(); // Quit the app, except on macOS where the user quits the app explicitly with command + Q.
  } // end if
});

app.setAboutPanelOptions({ credits: zhCN.default.appDescription });

// Exit cleanly on any request from the parent process in the dev mode.
if (isDev) {
  if (process.platform === global.common.WINDOWS) {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      } // end if
    });
  } else {
    process.on("SIGTERM", () => app.quit());
  } // end if...else
} // end if
