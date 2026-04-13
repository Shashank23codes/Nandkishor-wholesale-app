import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';
import { fork } from 'child_process';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();

let mainWindow;
let serverProcess;

function createServer() {
  // Path to the express server entry point
  const serverPath = path.join(__dirname, '..', 'server', 'server.js');
  const storagePath = store.get('data_storage_path') || '';

  // Start server as a child process
  serverProcess = fork(serverPath, [], {
    env: { ...process.env, PORT: 5000, IS_ELECTRON: true, DATA_STORAGE_PATH: storagePath }
  });

  serverProcess.on('message', (msg) => {
    console.log('Server message:', msg);
  });

  serverProcess.on('error', (err) => {
    console.error('Server error:', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    title: 'Nandkishor Wholesale',
    backgroundColor: '#020617', // Match slate-950
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '..', 'public', 'logo.png'), // Need to ensure an icon exists
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createServer();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/* ── IPC Handlers (Native Windows functions) ── */

// 1. Pick a folder
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (!result.canceled) {
    const path = result.filePaths[0];
    store.set('data_storage_path', path);
    return path;
  }
  return null;
});

// 2. Get current storage path
ipcMain.handle('get-storage-path', () => {
  return store.get('data_storage_path') || null;
});

// 3. Auto Updater Events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});
