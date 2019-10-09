// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const { autoUpdater } = require('electron-updater');
var path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 480,
    show: false,
    icon: path.join(__dirname, 'build/icon.icns')
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  mainWindow.loadURL('https://admin.pedfarma.com.br');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function() {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

// when receiving a restart_app signal, quit and install the new version ;)
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
