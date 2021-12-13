/*
 * @Description: the preload script
 * @Version: 1.0.0.20211213
 * @Author: Arvin Zhao
 * @Date: 2021-12-13 14:03:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-13 18:42:00
 */

import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object.
// Reference: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    if (["toMain"].includes(channel)) {
      ipcRenderer.send(channel, data);
    } // end if
  },
  receive: (channel, func) => {
    if (["fromMain"].includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args)); // Deliberately strip the event as it includes the sender.
    } // end if
  },
});
