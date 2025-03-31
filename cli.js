#!/usr/bin/env node

const { createCatPopup, isSleeping } = require("./main.js");
const readline = require("readline");
const { exec, spawn } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { networkInterfaces } = require("os");
const electron = require("electron");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("🐱 Mushie CLI Ready! Type 'help' for commands.");

const logFilePath = path.join(__dirname, "logs.txt");
const sleepFile = path.join(__dirname, "mushie_state.txt");

function logCommand(command) {
    const logEntry = `[${new Date().toISOString()}] ${command}\n`;
    fs.appendFileSync(logFilePath, logEntry, "utf8");
}

function showGPU() {
    exec("wmic path win32_VideoController get name", (err, stdout) => {
        if (err) return console.error("❌ Cannot fetch GPU info.");
        console.log("🎮 GPU Info:\n", stdout);
    });
}

function fetchPath(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    console.log(`🔍Searching for "${file}"... ( May take a while hooman))`);

    const searchCommand = `dir /s /b C:\\ | findstr /i "${file}"`;

    exec(searchCommand, (err, stdout, stderr) => {
        if (err || !stdout.trim()) {
            console.log(`❌ File not found: ${file}`);
        } else {
            console.log(`📂 Found:\n${stdout.trim()}`);
        }
    });
}

function showSystemInfo() {
    console.log(`🖥️ OS: ${os.type()} ${os.release()}`);
    console.log(`⚙️ CPU: ${os.cpus()[0].model}`);
    console.log(`💾 RAM: ${(os.totalmem() / 1e9).toFixed(2)} GB`);
}

function showRAMInfo() {
    console.log(`💾 Total RAM: ${(os.totalmem() / 1e9).toFixed(2)} GB`);
    console.log(`📉 Free RAM: ${(os.freemem() / 1e9).toFixed(2)} GB`);
}

function openFile(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    
    file = file.replace(/^"(.*)"$/, "$1");
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
        return console.log(`❌ File not found: ${filePath}`);
    }

    console.log(`📂 Opening ${filePath}...`);
    
    const openCommand = process.platform === "win32" ? `start "" "${filePath}"` : `open "${filePath}"`;
    exec(openCommand, (err) => {
        if (err) console.log("❌ Failed to open file.");
    });
}

function scratches() {
    console.log("🐾 Yayy purr purr 🐱");
}

function sleepMushie() {
    fs.writeFileSync(sleepFile, "sleep", "utf8");
    console.log("😴 Mushie is now sleeping. No more pop-ups until reboot or 'mushie wake up'.");
}

function wakeUpMushie() {
    if (fs.existsSync(sleepFile)) {
        fs.unlinkSync(sleepFile);
    }
    console.log("☀️ Mushie is awake! Pop-ups will resume.");
}

function createFile(filename) {
    if (!filename) return console.log("❌ Please provide a file name.");
    fs.writeFileSync(filename, "", "utf8");
    console.log(`📄 File '${filename}' created.`);
}

function getIP() {
    const nets = networkInterfaces();
    let ip = "Unknown";
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
                ip = net.address;
            }
        }
    }
    console.log(`🌍 Your IP: ${ip}`);
}

function openWebsite(url) {
    if (!url) return console.log("❌ Please provide a URL.");
    console.log(`🌐 Opening ${url}...`);
    exec(`start ${url}`);
}

function showHistory() {
    if (!fs.existsSync(logFilePath)) {
        console.log("📜 No history found.");
        return;
    }
    console.log("📜 Mushie Command History:");
    console.log(fs.readFileSync(logFilePath, "utf8"));
}

function clearHistory() {
    fs.writeFileSync(logFilePath, "", "utf8");
    console.log("🗑️ Mushie history cleared!");
}

function showPopup() {
    console.log("🐱 Showing Mushie popup...");
    const child = spawn(electron, [path.join(__dirname, 'main.js')], {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();
}

rl.on("line", (input) => {
    const [command, ...args] = input.trim().split(" ");
    const arg = args.join(" ");

    logCommand(input); 

    switch (command) {
        case "help": 
            console.log(`
🐱 Mushie CLI Commands:

  gpu              - Show GPU details
  sysinfo          - Show system info (OS, CPU, RAM)
  ram-info         - Show RAM usage details
  fetch <file>     - Get the full path of a file
  open <file>      - Open a file
  scratches        - Responds with "purr purr" 🐱
  sleep            - Stop the pop-up until reboot or 'mushie wake up'
  wake up          - Restart the pop-up with scheduling
  create <file>    - Create a new file
  ip               - Show your IP address
  web <url>        - Open a website in the default browser
  history          - Show past commands
  clear-history    - Clear command logs
  popup            - Show a Mushie popup right now
  exit             - Close Mushie CLI
`);
            break;
        case "gpu": showGPU(); break;
        case "sysinfo": showSystemInfo(); break;
        case "ram-info": showRAMInfo(); break;
        case "fetch": fetchPath(arg); break;
        case "open": openFile(arg); break;
        case "scratches": scratches(); break;
        case "sleep": sleepMushie(); break;
        case "wake":
            if (args[0] === "up") {
                wakeUpMushie();
            } else {
                console.log("Unknown command. Type 'help' for options.");
            }
            break;
        case "create": createFile(arg); break;
        case "ip": getIP(); break;
        case "web": openWebsite(arg); break;
        case "history": showHistory(); break;
        case "clear-history": clearHistory(); break;
        case "popup": showPopup(); break;
        case "exit": 
            console.log("Bye! 👋"); 
            rl.close(); 
            process.exit(0); 
            break;
        default: 
            console.log("Unknown command. Type 'help' for options.");
    }
});