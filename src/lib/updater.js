/*
 * @Description: the app updater
 * @Version: 1.1.3.20220303
 * @Author: Arvin Zhao
 * @Date: 2022-02-26 21:40:41
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-04 19:56:10
 */

import { app, dialog, Notification } from "electron";
import log from "electron-log";
import settings from "electron-settings";
import { autoUpdater } from "electron-updater";
import path from "path";

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
      .then((results) => {
        if (results.response === 0) {
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
 * Reference: https://github.com/electron-userland/electron-builder/blob/8bfeef83a9b1f75761596d33b9504c7dca1cac53/packages/electron-updater/src/AppUpdater.ts#L265
 *
 */
export async function updateAutomatically() {
  if (process.env.WEBPACK_DEV_SERVER_URL == null) {
    const receiveTestUpdates = await settings.get(
      global.common.RECEIVE_TEST_UPDATES_KEY
    );

    global.isAutoUpdateBusy = true;
    autoUpdater.autoDownload = true;
    autoUpdater.channel = receiveTestUpdates
      ? global.common.BETA
      : global.common.STABLE;
    autoUpdater.checkForUpdates().then((it) => {
      if (it != null && it.downloadPromise != null) {
        it.downloadPromise.then(() => {
          new Notification({
            body: `${zhCN.default.updateReadyBody}（V${app.getVersion()} → V${
              it.updateInfo.version
            }）`,
            // eslint-disable-next-line no-undef
            icon: path.join(__static, "assets/app_icon.png"),
            title: zhCN.default.updateReadyTitle,
          }).show();
        });
      }
    });
  } // end if
} // end function updateAutomatically

/**
 * Check for updates manually via a menu item.
 * @param {Electron.MenuItem} menuItem the menu item for checking for updates.
 */
export async function updateManually(menuItem) {
  if (global.isAutoUpdateBusy) {
    dialog.showMessageBox({
      message: zhCN.default.autoUpdateBusyMessage,
      title: app.name,
      type: "info",
    });
    return;
  } // end if

  const receiveTestUpdates = await settings.get(
    global.common.RECEIVE_TEST_UPDATES_KEY
  );

  menuItemCheckForUpdates = menuItem;
  menuItemCheckForUpdates.enabled = false;
  autoUpdater.autoDownload = false;
  autoUpdater.channel = receiveTestUpdates
    ? global.common.BETA
    : global.common.STABLE;
  autoUpdater.checkForUpdates();
} // end function checkForUpdates
