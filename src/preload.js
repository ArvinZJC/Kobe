/*
 * @Description: the preload script
 * @Version: 1.0.0.20211217
 * @Author: Arvin Zhao
 * @Date: 2021-12-13 14:03:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-17 23:31:36
 */

import { contextBridge, ipcRenderer } from "electron";

import global from "./lib/global.js";

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object.
// Reference: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
contextBridge.exposeInMainWorld(global.common.IPC_RENDERER_API_KEY, {
  receive: (channel, func) => {
    if ([global.common.IPC_RECEIVE].includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args)); // Deliberately strip the event as it includes the sender.
    } // end if
  },
  send: (channel, data) => {
    if ([global.common.IPC_SEND].includes(channel)) {
      ipcRenderer.send(channel, data);
    } // end if
  },
});
