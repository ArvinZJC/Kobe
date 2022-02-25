/*
 * @Description: the app window manager
 * @Version: 2.0.0.20220225
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 06:39:55
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-25 09:59:38
 */

import {
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  screen,
  webContents,
} from "electron";
import log from "electron-log";
import settings from "electron-settings";
import { platform } from "process";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

import * as zhCN from "../locales/zh-CN.json";
import global from "./global.js";
import { getInitialAppMenuTemplate, setAppMenu } from "./menu.js";
import {
  getPreference,
  initialisePreferences,
  resetPreferences,
} from "./preferences.js";
import { getSearchResultData } from "./processor.js";
import { TabbedWindow } from "./tabbed-window.js";

/**
 * Create a tabbed window.
 * @param {object} stockList the stock list.
 */
export async function createTabbedWin(stockList) {
  await initialisePreferences();

  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  var baseUrl;

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    baseUrl = process.env.WEBPACK_DEV_SERVER_URL; // Load the dev server URL if it exists.
  } else {
    createProtocol(global.common.APP_SCHEME);
    baseUrl = `${global.common.APP_SCHEME}://./index.html`; // Load "index.html" if the dev server URL does not exist.
  } // end if...else

  const winHeight = Math.round(height * 0.7);
  const winOptions = {
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? global.common.DARK_WIN_COLOUR
      : global.common.LIGHT_WIN_COLOUR,
    center: true,
    minHeight: global.common.WIN_HEIGHT_MIN,
    minWidth: global.common.WIN_WIDTH_MIN,
    titleBarOverlay: {
      color: global.common.TITLE_BAR_OVERLAY_COLOUR,
      height: global.common.TAB_BAR_HEIGHT,
      symbolColor: global.common.LIGHT_WIN_COLOUR,
    },
    titleBarStyle: platform === global.common.MACOS ? "hiddenInset" : "hidden",
  };
  const winWidth = Math.round(width * 0.7);
  var tabbedWin = new TabbedWindow({
    blankPage: baseUrl,
    blankTitle: zhCN.default.newTabItem,
    controlHeight: global.common.TAB_BAR_HEIGHT,
    controlPanel: `${baseUrl}/#/${global.common.TAB_BAR_VIEW}`,
    debug: process.env.NODE_ENV === global.common.DEV,
    height:
      winHeight >= global.common.WIN_HEIGHT_MIN
        ? winHeight
        : global.common.WIN_HEIGHT_MIN,
    startPage: baseUrl,
    viewReferences: { scrollBounce: true },
    width:
      winWidth >= global.common.WIN_WIDTH_MIN
        ? winWidth
        : global.common.WIN_WIDTH_MIN,
    winOptions,
  });

  initialiseIpcMainListener(stockList, tabbedWin);
  setAppMenu(tabbedWin);
  tabbedWin.on("closed", () => {
    tabbedWin = null;
  });
  tabbedWin.win.on("enter-full-screen", () => {
    const appMenuTemplate = getInitialAppMenuTemplate(tabbedWin);

    if (platform === global.common.MACOS) {
      appMenuTemplate[3].submenu[3].label = `${zhCN.default.exit}${zhCN.default.fullScreen}`;
    } else {
      appMenuTemplate[2].submenu[3].label = `${zhCN.default.exit}${zhCN.default.fullScreen}`;
    } // end if...else

    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));
    tabbedWin.controlView.webContents.send(
      global.common.IPC_RECEIVE,
      global.common.ENTER_FULL_SCREEN
    );
  });
  tabbedWin.win.on("leave-full-screen", () => {
    setAppMenu(tabbedWin);
    tabbedWin.controlView.webContents.send(
      global.common.IPC_RECEIVE,
      global.common.EXIT_FULL_SCREEN
    );
  });

  if (platform === global.common.WINDOWS) {
    tabbedWin.win.on("maximize", () => {
      const appMenuTemplate = getInitialAppMenuTemplate(tabbedWin);

      appMenuTemplate[3].submenu[1].label = zhCN.default.restore;
      Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));
    });
    tabbedWin.win.on("restore", () => setAppMenu(tabbedWin));
    tabbedWin.win.setMenuBarVisibility(true); // Although the menu bar is not actually visible on Windows due to the use of the frameless window, this line is required to enable the accelerators.
  } // end if
} // end function createTabbedWin

/**
 * Initialise the IPC main channel listener.
 * @param {object} stockList the stock list.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 */
function initialiseIpcMainListener(stockList, tabbedWin) {
  ipcMain.removeAllListeners([global.common.IPC_SEND]);
  ipcMain.on(global.common.IPC_SEND, async (event, data) => {
    const viewContents = webContents.fromId(event.sender.id);

    if (typeof data === "object") {
      switch (data[global.common.TAG_KEY]) {
        case global.common.GET_NEW_TAB_ITEM_ID: {
          const newTabId = {};

          newTabId[global.common.GET_NEW_TAB_ITEM_ID] =
            tabbedWin.tabs[tabbedWin.tabs.length - 1];
          newTabId[global.common.NEW_TAB_ITEM_INDEX_KEY] =
            data[global.common.NEW_TAB_ITEM_INDEX_KEY];
          viewContents.send(global.common.IPC_RECEIVE, newTabId);
          break;
        }
        case global.common.GET_SEARCH_RESULT_DATA: {
          const searchResultData = await getSearchResultData(
            data[global.common.END_DATE_KEY],
            data[global.common.START_DATE_KEY],
            data[global.common.STOCK_SYMBOL_KEY]
          );

          viewContents.send(global.common.IPC_RECEIVE, searchResultData);
          break;
        }
        case global.common.POP_UP_APP_MENU: {
          Menu.getApplicationMenu().popup(
            data[global.common.APP_MENU_POSITION_KEY]
          );
          break;
        }
        case global.common.SET_APPEARANCE: {
          await settings.set(
            global.common.APPEARANCE_KEY,
            data[global.common.APPEARANCE_KEY]
          );
          nativeTheme.themeSource = data[global.common.APPEARANCE_KEY];
          break;
        }
        case global.common.SET_DAY_VOLUME_DECIMAL_POINTS: {
          await settings.set(
            global.common.DAY_VOLUME_DECIMAL_POINTS_KEY,
            data[global.common.DAY_VOLUME_DECIMAL_POINTS_KEY]
          );
          break;
        }
        case global.common.SET_DAY_VOLUME_UNIT: {
          await settings.set(
            global.common.DAY_VOLUME_UNIT_KEY,
            data[global.common.DAY_VOLUME_UNIT_KEY]
          );
          break;
        }
        case global.common.SET_EXTERNAL_SEARCH: {
          await settings.set(
            global.common.EXTERNAL_SEARCH_KEY,
            data[global.common.EXTERNAL_SEARCH_KEY]
          );
          break;
        }
        case global.common.SET_INCLUDE_HIDDEN_COLUMNS: {
          await settings.set(
            global.common.INCLUDE_HIDDEN_COLUMNS_KEY,
            data[global.common.INCLUDE_HIDDEN_COLUMNS_KEY]
          );
          break;
        }
        case global.common.SET_MAX_DATE_RANGE_SPAN: {
          await settings.set(
            global.common.MAX_DATE_RANGE_SPAN_KEY,
            data[global.common.MAX_DATE_RANGE_SPAN_KEY]
          );
          break;
        }
        case global.common.SET_MIN_DATE: {
          await settings.set(
            global.common.MIN_DATE_KEY,
            data[global.common.MIN_DATE_KEY]
          );
          break;
        }
        case global.common.SET_SEARCH_ENGINE_MODE: {
          await settings.set(
            global.common.SEARCH_ENGINE_MODE_KEY,
            data[global.common.SEARCH_ENGINE_MODE_KEY]
          );
          break;
        }
        case global.common.SET_TOTAL_VOLUME_DECIMAL_POINTS: {
          await settings.set(
            global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY,
            data[global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY]
          );
          break;
        }
        case global.common.SET_TOTAL_VOLUME_UNIT: {
          await settings.set(
            global.common.TOTAL_VOLUME_UNIT_KEY,
            data[global.common.TOTAL_VOLUME_UNIT_KEY]
          );
          break;
        }
        default: {
          log.warn(
            "Unknown IPC channel event in the data message:",
            JSON.stringify(data)
          );
        }
      } // end switch-case
    } else {
      switch (data) {
        case global.common.CLOSE_WIN: {
          tabbedWin.win.close();
          break;
        }
        case global.common.CORRECT_WIN_COLOUR: {
          Array.prototype.forEach.call(
            BrowserWindow.getAllWindows(),
            (element) =>
              element.setBackgroundColor(
                nativeTheme.shouldUseDarkColors
                  ? global.common.DARK_WIN_COLOUR
                  : global.common.LIGHT_WIN_COLOUR
              )
          );
          break;
        }
        case global.common.GET_APPEARANCE: {
          const appearance = await getPreference(global.common.APPEARANCE_KEY);

          viewContents.send(global.common.IPC_RECEIVE, appearance);
          break;
        }
        case global.common.GET_DAY_VOLUME_DECIMAL_POINTS: {
          const dayVolumeDecimalPoints = await getPreference(
            global.common.DAY_VOLUME_DECIMAL_POINTS_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, dayVolumeDecimalPoints);
          break;
        }
        case global.common.GET_DAY_VOLUME_UNIT: {
          const dayVolumeUnit = await getPreference(
            global.common.DAY_VOLUME_UNIT_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, dayVolumeUnit);
          break;
        }
        case global.common.GET_EXTERNAL_SEARCH: {
          const externalSearch = await getPreference(
            global.common.EXTERNAL_SEARCH_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, externalSearch);
          break;
        }
        case global.common.GET_INCLUDE_HIDDEN_COLUMNS: {
          const includeHiddenColumns = await getPreference(
            global.common.INCLUDE_HIDDEN_COLUMNS_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, includeHiddenColumns);
          break;
        }
        case global.common.GET_MAX_DATE_RANGE_SPAN: {
          const maxDateRangeSpan = await getPreference(
            global.common.MAX_DATE_RANGE_SPAN_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, maxDateRangeSpan);
          break;
        }
        case global.common.GET_MIN_DATE: {
          const minDate = await getPreference(global.common.MIN_DATE_KEY);

          viewContents.send(global.common.IPC_RECEIVE, minDate);
          break;
        }
        case global.common.GET_PLATFORM: {
          const os = {};

          os[global.common.GET_PLATFORM] = platform;
          viewContents.send(global.common.IPC_RECEIVE, os);
          break;
        }
        case global.common.GET_SEARCH_ENGINE_MODE: {
          const searchEngineMode = await getPreference(
            global.common.SEARCH_ENGINE_MODE_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, searchEngineMode);
          break;
        }
        case global.common.GET_START_TAB_ITEM_ID: {
          const startTabItemId = {};

          startTabItemId[global.common.GET_START_TAB_ITEM_ID] =
            tabbedWin.tabs[0];
          viewContents.send(global.common.IPC_RECEIVE, startTabItemId);
          break;
        }
        case global.common.GET_STOCK_LIST: {
          viewContents.send(global.common.IPC_RECEIVE, stockList);
          break;
        }
        case global.common.GET_TOTAL_VOLUME_DECIMAL_POINTS: {
          const totalVolumeDecimalPoints = await getPreference(
            global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY
          );

          viewContents.send(
            global.common.IPC_RECEIVE,
            totalVolumeDecimalPoints
          );
          break;
        }
        case global.common.GET_TOTAL_VOLUME_UNIT: {
          const totalVolumeUnit = await getPreference(
            global.common.TOTAL_VOLUME_UNIT_KEY
          );

          viewContents.send(global.common.IPC_RECEIVE, totalVolumeUnit);
          break;
        }
        case global.common.GET_VOLUME_FORMAT: {
          var volumeFormat = []; // Indexes 0 and 1 are for day volumes, and the rest are for total volumes. For each volume type, the first one is the number of decimal points, and the second is the unit.

          volumeFormat[0] = await getPreference(
            global.common.DAY_VOLUME_DECIMAL_POINTS_KEY
          );
          volumeFormat[1] = await getPreference(
            global.common.DAY_VOLUME_UNIT_KEY
          );
          volumeFormat[2] = await getPreference(
            global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY
          );
          volumeFormat[3] = await getPreference(
            global.common.TOTAL_VOLUME_UNIT_KEY
          );
          viewContents.send(global.common.IPC_RECEIVE, volumeFormat);
          break;
        }
        case global.common.RESET_PREFERENCES: {
          await resetPreferences();
          viewContents.reload();
          break;
        }
        default: {
          log.warn(
            "Unknown IPC channel event in the data message:",
            JSON.stringify(data)
          );
        }
      } // end switch-case
    } // end if...else
  });
} // end function initialiseIpcMainListener

/**
 * Open a preference tab item if it does not exist. Otherwise, focus on the existing preference tab item.
 * @param {TabbedWindow} tabbedWin a tabbed window.
 */
export function showPreferenceTabItem(tabbedWin) {
  var baseUrl;
  const preferenceTabItemUrl = {};

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    baseUrl = process.env.WEBPACK_DEV_SERVER_URL;
  } else {
    baseUrl = `${global.common.APP_SCHEME}://./index.html`;
  } // end if...else

  preferenceTabItemUrl[
    global.common.SHOW_PREFERENCE_TAB_ITEM
  ] = `${baseUrl}/#/${global.common.PREFERENCE_VIEW}`;
  tabbedWin.controlView.webContents.send(
    global.common.IPC_RECEIVE,
    preferenceTabItemUrl
  );
} // end function showPreferenceTabItem
