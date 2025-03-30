const { app, BrowserWindow, screen, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  setTimeout(createCatPopup, 1000); // First pop-up after 1 sec
  setInterval(createCatPopup,  60 * 1000); // Every 2 hours
});

function createCatPopup() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 160,
    height: 280,
    x: width - 160,
    y: height - 160,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile("index.html");

  // Send message after loading
  mainWindow.webContents.once("did-finish-load", () => {
    const messages = ["Let's play hoomann🥺",
    "Hydrate yourself 😺","Hunting is good but taking a break is better😼",
    "Purr can i get some pets🙃"," Stretch your paws hooman🐾", "Did you drink water?😾","What a busy day, i napped a lot😺",
    "Fun fact: my creator thinks they are cat😹","Its a nice day, how about a break?🐱","take_a_break(hooman)","Keep going hooman😼"
    ,"Lets play catch!😺"];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    mainWindow.webContents.send("show-message", randomMessage);
  });

  // Close after 10 sec
  setTimeout(() => {
    if (mainWindow) mainWindow.close();
  }, 10000);
}
