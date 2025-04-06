const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadMinecraft, launchMinecraft, extraFile } = require('./SDK/index');
const UserLocal = require('os').userInfo().username;
const path = require('path');
let win;
function createWindow() {
    win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: path.join(__dirname,'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            backgroundThrottling: false
        },
        title: 'StepLauncher-Core',
    });

    win.setTitle('StepLauncher-Core');
    win.loadFile('index.html');
}

ipcMain.handle('installMinecraft', async (_event, version) => {
    try {
      await downloadMinecraft({
        root: '.StepLauncher',
        version,
        type: 'release',
        onProgress: (info) => {

          if (
            (info.percentage === undefined || info.percentage === null) &&
            info.downloaded != null &&
            info.total
          ) {
            info.percentage = Math.floor((info.downloaded / info.total) * 100);
          }
  
          if (win && !win.isDestroyed()) {
            win.webContents.send('progressUpdate', info);
          }
  
          // Para debugging
          console.log("📡 Progreso enviado al frontend:", info);
        }
      });
  
      return 'ok';
    } catch (e) {
      console.error("❌ Error instalando Minecraft:", e);
      throw e;
    }
  });
  
ipcMain.handle('ExecuteMinecraft', async (_event, version) => {
    try {
        await launchMinecraft({
            user: {
                username: UserLocal,
            },
            version,
            type: 'release',
            gameDirectory: '.StepLauncher',
            memory: {
                min: '2G',
                max: '6G',
            },
            java: "C:/Program Files/Java/jre1.8.0_441/bin/javaw.exe"
        });
        return 'ok';
    } catch (e) {
        console.error("Error lanzando");
        throw e;
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});