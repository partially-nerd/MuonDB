const {
    contextBridge,
    ipcRenderer
} = require("electron");

const pathify = require('path')
const fs = require('fs');

process.once('loaded', () => {
    window.addEventListener('message', evt => {
        if (evt.data.type === 'select-dirs') {
            ipcRenderer.send('select-dirs')
        }
    })
})

function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

contextBridge.exposeInMainWorld(
    "api", {
    read: (path) => fs.readFileSync(path, "utf-8"),
    write: (path, data) => { fs.writeFileSync(path, data, "utf-8") },
    list: (dir) => fs.readdirSync(dir, "utf-8", { recursive: true }),
    walk: (dir) => walk(dir),
    delete: (path) => { fs.unlinkSync(path); },
    exists: (path) => fs.existsSync(path),
    isfile: (path) => fs.lstatSync(path).isFile(),
    isdir: (path) => fs.lstatSync(path).isDirectory(),
    dirname: (path) => pathify.parse(path).dir,
    openFolder: async () => await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }),
}
);