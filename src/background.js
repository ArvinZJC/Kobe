/*
 * @Description: the app's entry point
 * @Version: 1.0.0.20220116
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-16 15:21:12
 */

import { app, BrowserWindow, ipcMain, protocol } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

import * as stockList from "../extensions/StockList/StockList.json";
import global from "./lib/global.js";
import { getSearchResultData } from "./lib/processor.js";
import { addTabbedAppWin, createWin } from "./lib/window.js";

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

  // Process the stock list data from the specific JSON file.
  Array.prototype.forEach.call(stockList.default, (element, index, array) => {
    const symbolParts = element[global.common.STOCK_SYMBOL_KEY].split("."); // Split the original value of the stock symbol key (e.g., "601006.SZ" => {"601006", "SZ"}).

    array[index][global.common.STOCK_SYMBOL_KEY] =
      symbolParts[1] + symbolParts[0];
  });

  // Listen and react to the event of the IPC channel.
  ipcMain.on(global.common.IPC_SEND, async (event, data) => {
    const win = BrowserWindow.getFocusedWindow();

    if (data === global.common.GET_APP_NAME) {
      win.webContents.send(global.common.IPC_RECEIVE, app.name);
    } // end if

    if (data === global.common.GET_CONTENT_SIZE) {
      win.webContents.send(global.common.IPC_RECEIVE, win.getContentSize());
    } // end if

    if (data === global.common.GET_STOCK_LIST) {
      win.webContents.send(global.common.IPC_RECEIVE, stockList.default);
    } // end if

    if (data[global.common.TAG_KEY] === global.common.GET_SEARCH_RESULT_DATA) {
      const searchResultData = await getSearchResultData(
        data[global.common.END_DATE_KEY],
        data[global.common.START_DATE_KEY],
        data[global.common.STOCK_SYMBOL_KEY]
      );

      win.webContents.send(global.common.IPC_RECEIVE, searchResultData);
    } // end if
  });

  await createWin(global.common.APP_WIN_ID, app.name);

  // Emitted when the app is activated.
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWin(global.common.APP_WIN_ID, app.name); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
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
