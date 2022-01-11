/*
 * @Description: the app's entry point
 * @Version: 1.0.0.20220112
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:58:44
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-12 04:00:08
 */

import { app, BrowserWindow, ipcMain, protocol, screen } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

import * as stockList from "../extensions/StockList/StockList.json";
import global from "./lib/global.js";
import { updateAppMenu } from "./lib/menu.js";
import { getSearchResultData } from "./lib/processor.js";

const isDev = process.env.NODE_ENV === global.common.DEV;
const path = require("path");

/**
 * Create a tabbed window.
 * @param {number} height : an integer indicating the window height
 * @param {number} width : an integer indicating the window width
 */
async function addTabbedWindow(height, width) {
  var win = BrowserWindow.getFocusedWindow();
  const tabbedWin = await createWindow(height, width);

  if (process.platform === global.common.MACOS) {
    win.addTabbedWindow(tabbedWin);
  } // end if
} // end function addTabbedWindow

/**
 * Create a window for contents.
 * @param {number} height : an integer indicating the window height
 * @param {number} width : an integer indicating the window width
 */
async function createWindow(height, width) {
  var win = new BrowserWindow({
    center: true,
    height,
    minHeight: global.common.WIN_HEIGHT_MIN,
    minWidth: global.common.WIN_WIDTH_MIN,
    tabbingIdentifier: global.common.TABBING_ID,
    title: app.name,
    webPreferences: {
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: isDev,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      preload: path.join(__dirname, "preload.js"),
      scrollBounce: true,
    },
    width,
    vibrancy: "window",
  });

  updateAppMenu(isDev);
  win.setMenuBarVisibility(false); // Hide the menu bar on Windows but keep the browser dev tools in dev mode.

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL); // Load the url of the dev server if in dev mode.
  } else {
    createProtocol(global.common.APP_SCHEME);
    win.loadURL(`${global.common.APP_SCHEME}://./index.html`); // Load the index.html if not in dev mode.
  } // end if...else
} // end function createWindow

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
    var symbolParts = element[global.common.STOCK_SYMBOL_KEY].split("."); // Split the original value of the stock symbol key (e.g., "601006.SZ" => {"601006", "SZ"}).

    array[index][global.common.STOCK_SYMBOL_KEY] =
      symbolParts[1] + symbolParts[0];
  });

  // Listen and react to the event of the IPC channel.
  ipcMain.on(global.common.IPC_SEND, async (event, data) => {
    var win = BrowserWindow.getFocusedWindow();

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

  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = Math.round(height * 0.7);
  const windowWidth = Math.round(width * 0.7);

  await createWindow(windowHeight, windowWidth);

  // Emitted when the app is activated.
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow(windowHeight, windowWidth); // It is common to recreate a window in the app on macOS when the dock icon is clicked and there are no other windows open.
    } // end if
  });

  // Emitted when the user clicks the native macOS new tab button.
  app.on("new-window-for-tab", async () => {
    await addTabbedWindow(windowHeight, windowWidth);
  });
});

// Emitted when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== global.common.MACOS) {
    app.quit(); // Quit when all windows are closed, except on macOS where the user quits the app explicitly with command + Q.
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
    process.on("SIGTERM", () => {
      app.quit();
    });
  } // end if...else
} // end if
