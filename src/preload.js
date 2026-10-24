
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("systemAPI", {
  ping: () => ipcRenderer.invoke("system:ping")
});
