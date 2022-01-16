/*
 * @Description: the app and context menu builder
 * @Version: 1.0.0.20220116
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 16:14:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-16 23:52:32
 */

import { app, Menu, shell } from "electron";
import contextMenu from "electron-context-menu";

import * as zhCN from "../locales/zh-CN.json";
import global from "./global.js";
import { showPreferenceWin } from "./window.js";

/**
 * Set the app menu.
 * Reference: https://github.com/electron/electron/blob/main/lib/browser/api/menu-item-roles.ts
 * @param {boolean} isDev a flag indicating if the app is in the dev mode.
 */
export function setAppMenu(isDev) {
  const menu = Menu.buildFromTemplate([
    ...(process.platform === global.common.MACOS
      ? [
          {
            label: app.name,
            role: "appMenu",
            submenu: [
              { label: `${zhCN.default.about}${app.name}`, role: "about" },
              { type: global.common.SEPARATOR },
              {
                accelerator: "CommandOrControl+,",
                click: () => {
                  showPreferenceWin();
                },
                label: zhCN.default.preferences,
              },
              { type: global.common.SEPARATOR },
              { label: zhCN.default.services, role: "services" },
              { type: global.common.SEPARATOR },
              { label: `${zhCN.default.hide}${app.name}`, role: "hide" },
              { label: zhCN.default.hideOthers, role: "hideOthers" },
              { label: zhCN.default.showAll, role: "unhide" },
              { type: global.common.SEPARATOR },
              {
                label:
                  process.platform === global.common.MACOS
                    ? `${zhCN.default.quit}${app.name}`
                    : zhCN.default.quit,
                role: "quit",
              },
            ],
          },
        ]
      : []),
    {
      label: zhCN.default.fileMenu,
      role: "fileMenu",
      submenu: [
        process.platform === global.common.MACOS
          ? { label: zhCN.default.closeWin, role: "close" }
          : {
              label:
                process.platform === global.common.MACOS
                  ? `${zhCN.default.quit} ${app.name}`
                  : zhCN.default.quit,
              role: "quit",
            },
      ],
    },
    {
      label: zhCN.default.editMenu,
      role: "editMenu",
      submenu: [
        { label: zhCN.default.undo, role: "undo" },
        { label: zhCN.default.redo, role: "redo" },
        { type: global.common.SEPARATOR },
        { label: zhCN.default.cut, role: "cut" },
        { label: zhCN.default.copy, role: "copy" },
        { label: zhCN.default.paste, role: "paste" },
        ...(process.platform === global.common.MACOS
          ? [
              {
                label: zhCN.default.pasteAndMatchStyle,
                role: "pasteAndMatchStyle",
              },
              { label: zhCN.default.delete, role: "delete" },
              { label: zhCN.default.selectAll, role: "selectAll" },
              { type: global.common.SEPARATOR },
              {
                label: zhCN.default.speech,
                submenu: [
                  { label: zhCN.default.startSpeaking, role: "startSpeaking" },
                  { label: zhCN.default.stopSpeaking, role: "stopSpeaking" },
                ],
              },
            ]
          : [
              { label: zhCN.default.delete, role: "delete" },
              { type: global.common.SEPARATOR },
              { label: zhCN.default.selectAll, role: "selectAll" },
            ]),
      ],
    },
    {
      label: zhCN.default.viewMenu,
      role: "viewMenu",
      submenu: [
        { label: zhCN.default.reload, role: "reload" },
        { label: zhCN.default.forceReload, role: "forceReload" },
        { type: global.common.SEPARATOR },
        { label: zhCN.default.actualSize, role: "resetZoom" },
        { label: zhCN.default.zoomIn, role: "zoomIn" },
        { label: zhCN.default.zoomOut, role: "zoomOut" },
        { type: global.common.SEPARATOR },
        { label: zhCN.default.enterFullScreen, role: "togglefullscreen" },
        ...(isDev
          ? [{ type: global.common.SEPARATOR }, { role: "toggleDevTools" }]
          : []),
      ],
    },
    {
      label: zhCN.default.windowMenu,
      role: "windowMenu",
      submenu: [
        { label: zhCN.default.minimise, role: "minimize" },
        { label: zhCN.default.zoom, role: "zoom" },
        ...(process.platform === global.common.MACOS
          ? [
              { type: global.common.SEPARATOR },
              { label: zhCN.default.bringAllToFront, role: "front" },
            ]
          : [{ label: zhCN.default.closeWin, role: "close" }]),
      ],
    },
    {
      label: zhCN.default.help,
      role: "help",
      submenu: [
        {
          enabled: false,
          label: zhCN.default.appHomePage,
        },
        {
          enabled: false,
          label: zhCN.default.userManual,
        },
        { type: global.common.SEPARATOR },
        {
          click: async () => {
            await shell.openExternal("https://github.com/ArvinZJC/Kobe");
          },
          label: zhCN.default.githubRepo,
        },
        {
          click: async () => {
            await shell.openExternal("https://github.com/ArvinZJC/Kobe/issues");
          },
          label: zhCN.default.viewIssues,
        },
        {
          click: async () => {
            await shell.openExternal(
              "https://github.com/ArvinZJC/Kobe/releases"
            );
          },
          label: zhCN.default.releaseNotes,
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
} // end function setAppMenu

/**
 * Set the context menu.
 * Reference: https://github.com/sindresorhus/electron-context-menu/blob/main/index.js
 * @param {boolean} isDev a flag indicating if the app is in the dev mode.
 * @param {BrowserWindow} win the window owning the context menu.
 */
export function setContextMenu(isDev, win) {
  const showSearchWithBaidu = true; // TODO: Baidu or Google as per user preferences.
  contextMenu({
    menu: (actions, params, currentWin, dictionarySuggestions) => [
      dictionarySuggestions.length > 0 && actions.separator(),
      ...dictionarySuggestions,
      actions.separator(),
      actions.learnSpelling(),
      actions.separator(),
      actions.lookUpSelection(),
      actions.separator(),
      showSearchWithBaidu && {
        click: async () => {
          await shell.openExternal(
            `https://www.baidu.com/s?wd=${encodeURIComponent(
              params.selectionText
            )}`
          );
        },
        label: `${zhCN.default.searchWithBaidu}“{selection}”`,
        visible: params.selectionText.trim().length > 0,
      },
      !showSearchWithBaidu && actions.searchWithGoogle(),
      actions.separator(),
      {
        accelerator: "CommandOrControl+Z",
        click: () => currentWin.webContents.undo(),
        enabled: params.editFlags.canUndo,
        visible: params.isEditable,
        label: zhCN.default.undo,
      },
      {
        accelerator:
          process.platform === global.common.MACOS
            ? "Shift+CommandOrControl+Z"
            : "Control+Y",
        click: () => currentWin.webContents.redo(),
        enabled: params.editFlags.canRedo,
        visible: params.isEditable,
        label: zhCN.default.redo,
      },
      actions.separator(),
      actions.copyLink(),
      actions.separator(),
      {
        accelerator: "CommandOrControl+X",
        click: () => currentWin.webContents.cut(),
        enabled: params.editFlags.canCut,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.cut,
      },
      {
        accelerator: "CommandOrControl+C",
        click: () => currentWin.webContents.copy(),
        enabled: params.editFlags.canCopy,
        registerAccelerator: false,
        visible: params.isEditable || params.selectionText.length > 0,
        label: zhCN.default.copy,
      },
      {
        accelerator: "CommandOrControl+V",
        click: () => currentWin.webContents.paste(),
        enabled: params.editFlags.canPaste,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.paste,
      },
      process.platform === global.common.MACOS && {
        accelerator: "Cmd+Option+Shift+V",
        click: () => currentWin.webContents.pasteAndMatchStyle(),
        enabled: params.editFlags.canPaste,
        registerAccelerator: false,
        visible: params.isEditable,
        label: zhCN.default.pasteAndMatchStyle,
      },
      {
        click: () => currentWin.webContents.delete(),
        enabled: params.editFlags.canDelete,
        visible: params.isEditable,
        label: zhCN.default.delete,
      },
      {
        accelerator: "CommandOrControl+A",
        click: () => currentWin.webContents.selectAll(),
        enabled: params.editFlags.canSelectAll,
        visible: params.isEditable || params.selectionText.length > 0,
        label: zhCN.default.selectAll,
      },
      actions.separator(),
      {
        accelerator: "CmdOrCtrl+R",
        click: () => currentWin.reload(),
        label: zhCN.default.reload,
      },
      {
        accelerator: "Shift+CmdOrCtrl+R",
        click: () => currentWin.webContents.reloadIgnoringCache(),
        label: zhCN.default.forceReload,
      },
      actions.separator(),
      isDev && actions.inspect(),
      actions.separator(),
    ],
    labels: {
      copy: zhCN.default.copy,
      copyLink: zhCN.default.copyLink,
      cut: zhCN.default.cut,
      learnSpelling: zhCN.default.learnSpelling,
      lookUpSelection: `${zhCN.default.lookUp}“{selection}”`,
      paste: zhCN.default.paste,
      searchWithGoogle: `${zhCN.default.searchWithGoogle}“{selection}”`,
    },
    window: win,
  });
}
