const { app, BrowserWindow, screen } = require("electron");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

let mainWindow;
const sleepFile = path.join(__dirname, "mushie_state.txt");

if (require.main === module) { 
  app.whenReady().then(() => { 

  setTimeout(createCatPopup, 1000); 

 
  cron.schedule("0 */2 * * *", () => {
    if (!isSleeping()) {
      createCatPopup();
    }
  });
});

function isSleeping() {
  return fs.existsSync(sleepFile) && fs.readFileSync(sleepFile, "utf8").trim() === "sleep";
}

function createCatPopup() {
  if (isSleeping()) return; 

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
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.webContents.once("did-finish-load", () => {
    const messages = [
      "Hydrate yourself 😺",
      "Hunting is good but taking a break is better😼",
      "Purr can i get some pets🙃",
      "Stretch your paws hooman🐾",
      "Did you drink water yet?😾",
      "What a busy day, i napped a lot😺",
      "Fun fact: my creator thinks they are a cat😹",
      "It's a nice day, how about a break?🐱",
      "take_a_break(hooman)",
      "Keep going hooman😼",
      "Let's play catch!😺",
      "Meowster programmer, even the best coders need a pause! 🖥️🐾",
      "Fun fact: I can jump higher than you😼",
      "Life is about balance: Work. Play. Nap. Repeat. 😸",
      "Pawse for a moment! Did you blink in the last hour? 👀🐾"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    mainWindow.webContents.send("show-message", randomMessage);
  });

  // Close after 10 sec
  setTimeout(() => {
    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }
  }, 10000);
}
}