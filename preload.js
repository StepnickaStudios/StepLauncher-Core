const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  onProgressUpdate: (callback) => ipcRenderer.on('progressUpdate', (_event, data) => callback(data)),
  installMinecraft: (version, type) => ipcRenderer.invoke('installMinecraft', version, type),
  executeGame: (version, type) => ipcRenderer.invoke('ExecuteMinecraft', version, type),
});
