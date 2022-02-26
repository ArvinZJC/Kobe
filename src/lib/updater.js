/*
 * @Description: the app updater
 * @Version: 1.0.0.20220226
 * @Author: Arvin Zhao
 * @Date: 2022-02-26 21:40:41
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-26 23:36:50
 */

import { app, dialog } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

import * as zhCN from "../locales/zh-CN.json";

var menuItemCheckForUpdates;

log.transports.file.level = global.common.MIN_LOG_LEVEL;
autoUpdater.on("error", (e) => {
  log.error(
    "Failed to check for updates:",
    e == null ? global.common.UNKNOWN : (e.stack || e).toString()
  );

  if (!autoUpdater.autoDownload) {
    dialog.showErrorBox(
      zhCN.default.updateErrorTitle,
      zhCN.default.updateErrorContent
    );
  } // end if
});
autoUpdater.on("update-available", (updateInfo) => {
  if (!autoUpdater.autoDownload) {
    dialog
      .showMessageBox({
        buttons: [zhCN.default.confirm, zhCN.default.cancel],
        message: `${
          zhCN.default.updateAvailabeMessage
        }（V${app.getVersion()} → V${updateInfo.version}）`,
        title: zhCN.default.updateAvailableTitle,
        type: "info",
      })
      .then((buttonIndex) => {
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        } else {
          menuItemCheckForUpdates.enabled = true;
          menuItemCheckForUpdates = null;
        } // end if...else
      });
  } // end if
});
autoUpdater.on("update-downloaded", () => {
  if (!autoUpdater.autoDownload) {
    dialog
      .showMessageBox({
        message: zhCN.default.updateDownloadedMessage,
        title: zhCN.default.updateReadyTitle,
      })
      .then(() => {
        setImmediate(() => autoUpdater.quitAndInstall());
      });
  } // end if
});
autoUpdater.on("update-not-available", () => {
  if (!autoUpdater.autoDownload) {
    dialog.showMessageBox({
      message: zhCN.default.noUpdatesMessage,
      title: zhCN.default.noUpdatesTitle,
    });
    menuItemCheckForUpdates.enabled = true;
    menuItemCheckForUpdates = null;
  } // end if
});

/**
 * Check for updates and notify when an update is available.
 */
export function updateAutomatically() {
  if (process.env.WEBPACK_DEV_SERVER_URL == null) {
    autoUpdater.autoDownload = true;
    autoUpdater.checkForUpdatesAndNotify({
      body: `{appName}${
        zhCN.default.updateReadyBody
      }（V${app.getVersion()} → V{version}）`,
      title: zhCN.default.updateReadyTitle,
    });
  } // end if
} // end function updateAutomatically

/**
 * Check for updates manually via a menu item.
 * @param {Electron.MenuItem} menuItem the menu item for checking for updates.
 */
export function updateManually(menuItem) {
  menuItemCheckForUpdates = menuItem;
  menuItemCheckForUpdates.enabled = false;
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
} // end function checkForUpdates
