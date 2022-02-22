/*
 * @Description: the preload script
 * @Version: 1.1.0.20220222
 * @Author: Arvin Zhao
 * @Date: 2021-12-13 14:03:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-22 22:46:45
 */

import { contextBridge, ipcRenderer } from "electron";

import global from "./lib/global.js";

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object.
// Reference: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
contextBridge.exposeInMainWorld(global.common.IPC_RENDERER_API_KEY, {
  receive: (channel, func) => {
    if (
      [global.common.IPC_RECEIVE, global.common.TAB_BAR_TABS_UPDATE].includes(
        channel
      )
    ) {
      ipcRenderer.on(channel, (event, ...args) => func(...args)); // Deliberately strip the event as it includes the sender.
    } // end if
  },
  send: (channel, data) => {
    if (
      [
        global.common.CLOSE_TAB_ITEM,
        global.common.IPC_SEND,
        global.common.NEW_TAB_ITEM,
        global.common.SWITCH_TAB_ITEM,
        global.common.TAB_BAR_READY,
      ].includes(channel)
    ) {
      ipcRenderer.send(channel, data);
    } // end if
  },
});
