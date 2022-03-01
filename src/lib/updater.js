/*
 * @Description: the app updater
 * @Version: 1.1.1.20220227
 * @Author: Arvin Zhao
 * @Date: 2022-02-26 21:40:41
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-27 23:32:49
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

  if (autoUpdater.autoDownload) {
    global.isAutoUpdateBusy = false;
    return;
  } // end if

  dialog.showMessageBox({
    message: zhCN.default.updateErrorMessage,
    title: app.name,
    type: "error",
  });
  menuItemCheckForUpdates.enabled = true;
  menuItemCheckForUpdates = null;
});
autoUpdater.on("update-available", (updateInfo) => {
  if (!autoUpdater.autoDownload) {
    dialog
      .showMessageBox({
        buttons: [zhCN.default.confirm, zhCN.default.cancel],
        cancelId: 1,
        detail: `V${app.getVersion()} → V${updateInfo.version}`,
        message: zhCN.default.updateAvailableMessage,
        noLink: true,
        title: app.name,
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
autoUpdater.on("update-downloaded", (updateInfo) => {
  if (autoUpdater.autoDownload) {
    global.isAutoUpdateBusy = false;
    return;
  } // end if

  dialog
    .showMessageBox({
      detail: `V${app.getVersion()} → V${updateInfo.version}`,
      message: zhCN.default.updateDownloadedMessage,
      title: app.name,
      type: "info",
    })
    .then(() => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
});
autoUpdater.on("update-not-available", () => {
  if (autoUpdater.autoDownload) {
    global.isAutoUpdateBusy = false;
    return;
  } // end if

  dialog.showMessageBox({
    detail: `V${app.getVersion()}`,
    message: zhCN.default.noUpdatesMessage,
    title: app.name,
    type: "info",
  });
  menuItemCheckForUpdates.enabled = true;
  menuItemCheckForUpdates = null;
});

/**
 * Check for updates and notify when an update is available.
 */
export function updateAutomatically() {
  if (process.env.WEBPACK_DEV_SERVER_URL == null) {
    global.isAutoUpdateBusy = true;
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
  if (global.isAutoUpdateBusy) {
    dialog.showMessageBox({
      message: zhCN.default.autoUpdateBusyMessage,
      title: app.name,
      type: "info",
    });
    return;
  } // end if

  menuItemCheckForUpdates = menuItem;
  menuItemCheckForUpdates.enabled = false;
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
} // end function checkForUpdates
