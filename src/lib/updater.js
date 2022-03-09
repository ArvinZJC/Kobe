/*
 * @Description: the app updater
 * @Version: 1.1.5.20220309
 * @Author: Arvin Zhao
 * @Date: 2022-02-26 21:40:41
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-09 21:26:53
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
 * Configure the updater.
 * @param {boolean} autoDownload a flag indicating whether to automatically download an update when it is found.
 */
async function configUpdater(autoDownload) {
  const receiveTestUpdates = await settings.get(
    global.common.RECEIVE_TEST_UPDATES_KEY
  );

  autoUpdater.allowPrerelease = receiveTestUpdates; // Required for releasing using channels to support GitHub. Reference: https://github.com/electron-userland/electron-builder/pull/6505
  autoUpdater.autoDownload = autoDownload;
  autoUpdater.channel = receiveTestUpdates
    ? global.common.BETA
    : global.common.STABLE;
  autoUpdater.allowDowngrade = false; // It is necessary to put after defining the channel. Reference: https://github.com/electron-userland/electron-builder/blob/e6312cb54e5d957289d5c07b506491fcaea9e334/packages/electron-updater/src/AppUpdater.ts#L83
} // end function configUpdater

/**
 * Check for updates and notify when an update is available.
 * Reference: https://github.com/electron-userland/electron-builder/blob/8bfeef83a9b1f75761596d33b9504c7dca1cac53/packages/electron-updater/src/AppUpdater.ts#L265
 *
 */
export async function updateAutomatically() {
  if (process.env.WEBPACK_DEV_SERVER_URL == null) {
    global.isAutoUpdateBusy = true;
    await configUpdater(true);
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

  menuItemCheckForUpdates = menuItem;
  menuItemCheckForUpdates.enabled = false;
  await configUpdater(false);
  autoUpdater.checkForUpdates();
} // end function checkForUpdates
