const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getStoragePath: () => ipcRenderer.invoke('get-storage-path'),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', cb),
  restartApp: () => ipcRenderer.send('restart-app')
});
