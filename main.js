const { app, BrowserWindow, screen } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  setTimeout(createCatPopup, 1000); // Wait 1 sec before first pop-up
  setInterval(createCatPopup, 2 * 60 * 60 * 1000); // Repeat every 2 hours
});

function createCatPopup() {
  const display = screen.getPrimaryDisplay(); // ✅ Get screen size
  const { width, height } = display.workAreaSize; // ✅ Extract width & height

  mainWindow = new BrowserWindow({
    width: 150,  // Small cat pop-up
    height: 150,
    x: width - 160,  // ✅ Position at bottom-right
    y: height - 130,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("index.html");

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (mainWindow) mainWindow.close();
  }, 10000);
}
