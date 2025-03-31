const { app, BrowserWindow, screen } = require("electron");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

let mainWindow;
const sleepFile = path.join(__dirname, "mushie_state.txt");

function isSleeping() {
  const sleeping = fs.existsSync(sleepFile) && fs.readFileSync(sleepFile, "utf8").trim() === "sleep";
  console.log(`isSleeping() = ${sleeping}`);
  return sleeping;
}

function createCatPopup() {
  console.log("createCatPopup() called...");
  if (isSleeping()) {
    console.log("Sleeping. Skipping popup.");
    return;
  }

  if (!app.isReady()) {
    app.whenReady().then(createCatPopup);
    return;
  }

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  console.log(`Display size: ${width}x${height}`);

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

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  console.log("Window loaded with index.html");

  mainWindow.webContents.once("did-finish-load", () => {
    console.log("Page loaded inside the popup.");
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
    console.log(`Sending message: ${randomMessage}`);
    mainWindow.webContents.send("show-message", randomMessage);
  });


  setTimeout(() => {
    if (mainWindow) {
      console.log("Closing popup after 10 seconds.");
      mainWindow.close();
      mainWindow = null;
    }
  }, 10000);
}

if (require.main === module) {
  app.whenReady().then(() => {
    console.log("App is ready. Creating first popup...");
    setTimeout(createCatPopup, 1000);

    cron.schedule("0 */2 * * *", () => {
      if (!isSleeping()) {
        createCatPopup();
      }
    });
  });
}

module.exports = {
  createCatPopup,
  isSleeping
};