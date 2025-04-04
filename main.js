const { app, BrowserWindow, screen } = require("electron");
const cron = require("node-cron");
const path = require("path");

let mainWindow;
const messages = [
  "Let's play hooman 🥺",
  "Hydrate yourself 😺",
  "Hunting is good but taking a break is better 😼",
  "Purr can I get some pets? 🙃",
  "Stretch your paws hooman 🐾",
  "Did you drink water? 😾",
  "What a busy day, I napped a lot 😺",
  "Fun fact: my creator thinks they are a cat 😹",
  "It's a nice day, how about a break? 🐱",
  "take_a_break(hooman)",
  "Keep going hooman 😼",
  "Let's play catch! 😺",
];

app.whenReady().then(() => {
  setTimeout(createCatPopup, 1000);
  cron.schedule("0 */1 * * *", createCatPopup);
});
app.on("window-all-closed", (e) => {
  e.preventDefault(); // Doesnt quit
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
    hasShadow: false,
    thickFrame: false,
    skipTaskbar: true,
    titleBarStyle: "hidden",
    visualEffectState: "active",
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
  }

  });

  mainWindow.setIgnoreMouseEvents(false, { forward: true });
  mainWindow.setOpacity(1);
  mainWindow.loadFile("index.html");

  mainWindow.webContents.once("did-finish-load", () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    mainWindow.webContents.executeJavaScript(`
        document.getElementById("message").innerText = "${randomMessage}";
        document.getElementById("bubble").style.display = "block";
    `);
  });

  setTimeout(() => {
    if (mainWindow) mainWindow.close();
  }, 10000);
}
