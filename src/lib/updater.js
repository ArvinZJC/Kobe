/*
 * @Description: the app updater
 * @Version: 1.0.4.20220227
 * @Author: Arvin Zhao
 * @Date: 2022-02-26 21:40:41
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-27 18:26:07
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
    dialog.showMessageBox({
      message: zhCN.default.updateErrorMessage,
      title: app.name,
      type: "error",
    });
  } // end if
});
autoUpdater.on("update-available", (updateInfo) => {
  if (!autoUpdater.autoDownload) {
    dialog
      .showMessageBox({
        buttons: [zhCN.default.confirm, zhCN.default.cancel],
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
  if (!autoUpdater.autoDownload) {
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
  } // end if
});
autoUpdater.on("update-not-available", () => {
  if (!autoUpdater.autoDownload) {
    dialog.showMessageBox({
      detail: `V${app.getVersion()}`,
      message: zhCN.default.noUpdatesMessage,
      title: app.name,
      type: "info",
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
  if (autoUpdater.isUpdaterActive()) {
    dialog.showMessageBox({
      message: zhCN.default.updaterActiveMessage,
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
