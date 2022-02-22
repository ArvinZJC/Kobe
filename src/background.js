/*
 * @Description: the app's entry point
 * @Version: 1.0.7.20220221
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-21 22:38:13
 */

import { app, BrowserWindow, protocol } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import electronDl from "electron-dl";
import log from "electron-log";
import { platform } from "process";

import global from "./lib/global.js";
import { createTabbedWin } from "./lib/window.js";
import * as zhCN from "./locales/zh-CN.json";
import * as stockList from "../extensions/stock-list/StockList.json";

const isDev = process.env.NODE_ENV === global.common.DEV;

protocol.registerSchemesAsPrivileged([
  {
    scheme: global.common.APP_SCHEME,
    privileges: { secure: true, standard: true },
  },
]); // Scheme must be registered before the app is ready.
electronDl({
  openFolderWhenDone: true,
  errorMessage: `{filename} ${zhCN.default.downloadErrorMessage}`,
  errorTitle: zhCN.default.downloadErrorTitle,
}); // Configure file downloads.

// Perform specific tasks when the app is ready.
app.whenReady().then(async () => {
  if (isDev && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS); // Install Vue 3 Devtools.
    } catch (e) {
      log.error("Failed to install Vue 3 Devtools:", e.stack);
    } // end try...catch
  } // end if

  Array.prototype.forEach.call(stockList.default, (element, index, array) => {
    const symbolParts = element[global.common.STOCK_SYMBOL_KEY].split("."); // Split the original value of the stock symbol key (e.g., "601006.SZ" => {"601006", "SZ"}).

    array[index][global.common.STOCK_SYMBOL_KEY] =
      symbolParts[1] + symbolParts[0];
  }); // Process the stock list data from the specific JSON file.
  await createTabbedWin(stockList.default);

  // Emitted when the app is activated.
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createTabbedWin(stockList.default); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
    } // end if
  });
});

// Emitted when all windows have been closed.
app.on("window-all-closed", () => {
  if (platform !== global.common.MACOS) {
    app.quit(); // Quit the app, except on macOS where the user quits the app explicitly with command + Q.
  } // end if
});

app.setAboutPanelOptions({ credits: zhCN.default.appDescription });

// Exit cleanly on any request from the parent process in the dev mode.
if (isDev) {
  if (platform === global.common.WINDOWS) {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      } // end if
    });
  } else {
    process.on("SIGTERM", () => app.quit());
  } // end if...else
} // end if
