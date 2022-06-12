/*
 * @Description: the app's entry point
 * @Version: 1.1.4.20220612
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-06-12 17:31:27
 */

import { app, BrowserWindow, protocol } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import electronDl from "electron-dl";
import log from "electron-log";
import { platform } from "process";

import global from "./lib/global.js";
import { createTabbedWin } from "./lib/window.js";
import * as zhHansCn from "./locales/zh-Hans-CN.json";
import * as stockList from "../extensions/stock-list-update-checker/stock-list.json";

var tabbedWin;

log.transports.file.level = global.common.MIN_LOG_LEVEL;

if (app.requestSingleInstanceLock()) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: global.common.APP_SCHEME,
      privileges: { secure: true, standard: true },
    },
  ]); // Scheme must be registered before the app is ready.
  electronDl({
    openFolderWhenDone: true,
    errorMessage: `{filename} ${zhHansCn.default.downloadErrorMessage}`,
    errorTitle: app.name,
  }); // Configure file downloads.

  if (platform === global.common.WINDOWS) {
    app.setAppUserModelId(app.name); // Change the app user model ID on Windows to avoid showing "electron.app.XXX" in any system notification sent by the app.
  } // end if

  app.on("second-instance", () => {
    if (tabbedWin != null) {
      if (tabbedWin.win.isMinimized()) {
        tabbedWin.win.restore();
      } // end if

      tabbedWin.win.focus();
    } // end if
  });
  app.on("window-all-closed", () => {
    tabbedWin = null;

    if (platform !== global.common.MACOS) {
      app.quit(); // Quit the app, except on macOS where the user quits the app explicitly with command + Q.
    } // end if
  });
  app.setAboutPanelOptions({ credits: zhHansCn.default.appDescription });
  app.whenReady().then(async () => {
    log.info(`Starting ${app.name} V${app.getVersion()}`);
    if (process.env.NODE_ENV === global.common.DEV && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS3_DEVTOOLS); // Install Vue 3 Devtools.
      } catch (e) {
        log.error(
          "Failed to install Vue 3 Devtools:",
          e == null ? global.common.UNKNOWN : (e.stack || e).toString()
        );
      } // end try...catch
    } // end if

    Array.prototype.forEach.call(stockList.default, (element, index, array) => {
      const symbolParts = element[global.common.STOCK_SYMBOL_KEY].split("."); // Split the original value of the stock symbol key (e.g., "601006.SZ" => {"601006", "SZ"}).

      array[index][global.common.STOCK_SYMBOL_KEY] =
        symbolParts[1] + symbolParts[0];
    }); // Process the stock list data from the specific JSON file.
    tabbedWin = await createTabbedWin(stockList.default);

    app.on("activate", async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        tabbedWin = await createTabbedWin(stockList.default); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
      } // end if
    });
  });

  // Exit cleanly on any request from the parent process in the dev mode.
  if (process.env.NODE_ENV === global.common.DEV) {
    if (platform === global.common.WINDOWS) {
      process.on("message", (data) => {
        if (data === "graceful-exit") {
          tabbedWin = null;
          app.quit();
        } // end if
      });
    } else {
      process.on("SIGTERM", () => {
        tabbedWin = null;
        app.quit();
      });
    } // end if...else
  } // end if
} else {
  app.quit();
} // end if...else
