const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getStoragePath: () => ipcRenderer.invoke('get-storage-path'),
  selectPosterFolder: () => ipcRenderer.invoke('select-poster-folder'),
  getPosterStoragePath: () => ipcRenderer.invoke('get-poster-storage-path'),
  restartServer: () => ipcRenderer.send('restart-server'),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', cb),
  restartApp: () => ipcRenderer.send('restart-app')
});
