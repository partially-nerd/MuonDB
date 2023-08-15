const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: 0,
    backgroundColor: '#fff',
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'public/preload.js')
    }
  });

  async function getItem(key) {
    return win.webContents
      .executeJavaScript(`window.localStorage.getItem('${key}')`, true)
  }

  async function setItem(key, val) {
    return win.webContents
      .executeJavaScript(`window.localStorage.setItem('${key}', '${val}')`, true)
  }

  ipcMain.on('select-dirs', async (event, arg) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    }).catch(error => { throw error })
    if (result.filePaths.length == 0) return;
    dir = result.filePaths[0];
    console.log(dir);
    recents = JSON.parse(await getItem('recents')) || [];
    if (recents.includes(dir)) {
      recents = recents.filter(x => x !== dir);
      recents.push(dir);
      await setItem("recents", JSON.stringify(recents));
      win.loadFile("public/app/edit.html");
      return;
    }
    if (recents.length == 4) {
      recents = recents.filter(x => x !== recents[0]);
    }
    recents.push(dir);
    await setItem("recents", JSON.stringify(recents));
    win.loadFile("public/app/edit.html");
  })
  win.loadFile('public/index.html');
}

app.whenReady().then(() => {
  createWindow();
})