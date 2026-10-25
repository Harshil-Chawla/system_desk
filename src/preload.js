
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("systemAPI", {
  ping: () => ipcRenderer.invoke("system:ping"),

  getInfo: () => ipcRenderer.invoke("system:get-info"),

  exportReport: () => ipcRenderer.invoke("system:export-report")
});
