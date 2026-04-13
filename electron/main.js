import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
import { fork } from 'child_process';
import Store from 'electron-store';

const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();

let mainWindow;
let serverProcess;

function createServer() {
  // Path to the express server entry point
  const serverPath = path.join(__dirname, '..', 'server', 'server.js');
  const storagePath = store.get('data_storage_path') || '';
  const posterPath = store.get('poster_storage_path') || '';

  console.log(`🚀 Starting background server: ${serverPath}`);

  // Start server as a child process with piped output
  serverProcess = fork(serverPath, [], {
    silent: true, // This allows us to capture stdout/stderr
    env: { 
      ...process.env, 
      PORT: 5000, 
      IS_ELECTRON: true, 
      DATA_STORAGE_PATH: storagePath,
      POSTER_STORAGE_PATH: posterPath
    }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server]: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data}`);
  });

  serverProcess.on('message', (msg) => {
    console.log('[Server Message]:', msg);
  });

  serverProcess.on('exit', (code) => {
    console.error(`[Server]: Process exited with code ${code}`);
  });

  serverProcess.on('error', (err) => {
    console.error('[Server]: Process error:', err);
  });
}

function createWindow() {
  const iconPath = path.join(__dirname, '..', 'public', 'favicon.png');
  
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
    icon: iconPath,
  });

  if (!app.isPackaged) {
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

// 1. Pick a folder (Data)
ipcMain.handle('select-folder', async () => {
  const win = mainWindow || BrowserWindow.getFocusedWindow();
  console.log('IPC: select-folder triggered');
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Select Database & Images Folder'
  });
  
  if (!result.canceled) {
    const path = result.filePaths[0];
    console.log('IPC: folder selected:', path);
    store.set('data_storage_path', path);
    return path;
  }
  return null;
});

// 2. Get current storage path
ipcMain.handle('get-storage-path', () => {
  return store.get('data_storage_path') || null;
});

// 3. Pick a folder (Posters)
ipcMain.handle('select-poster-folder', async () => {
  const win = mainWindow || BrowserWindow.getFocusedWindow();
  console.log('IPC: select-poster-folder triggered');
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Select Showcase Posters Folder'
  });
  
  if (!result.canceled) {
    const path = result.filePaths[0];
    console.log('IPC: poster folder selected:', path);
    store.set('poster_storage_path', path);
    return path;
  }
  return null;
});

// 4. Get current poster storage path
ipcMain.handle('get-poster-storage-path', () => {
  return store.get('poster_storage_path') || null;
});

// 5. Restart server (To apply new paths)
ipcMain.on('restart-server', () => {
  console.log('IPC: restart-server requested');
  if (serverProcess) {
    serverProcess.once('exit', () => {
      console.log('Server process exited. Restarting with new paths...');
      createServer();
    });
    serverProcess.kill();
  } else {
    createServer();
  }
});

// 6. Auto Updater Events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});
