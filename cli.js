#!/usr/bin/env node

const readline = require("readline");
const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { networkInterfaces } = require("os");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("🐱 Mushie CLI Ready! Type 'help' for commands.");

// Log file path
const logFilePath = path.join(__dirname, "logs.txt");

function logCommand(command) {
    const logEntry = `[${new Date().toISOString()}] ${command}\n`;
    fs.appendFileSync(logFilePath, logEntry, "utf8");
}


function showHelp() {
    console.log(`
🐱 Mushie CLI Commands:

  gpu              - Show GPU details
  sysinfo         - Show system info (OS, CPU, RAM)
  ram-info        - Show RAM usage details
  fetch <file>    - Get the full path of a file
  open <file>     - Open a file or folder
  scratches       - Responds with "purr purr" 🐱
  sleep           - Stop the pop-up until reboot or 'mushie wake up'
  wake up         - Restart the pop-up with scheduling
  create <file>   - Create a new file
  ip              - Show your IP address
  web <url>       - Open a website in the default browser
  history         - Show past commands
  clear-history   - Clear command logs
  exit            - Close Mushie CLI
`);
}

function showGPU() {
    exec("wmic path win32_VideoController get name", (err, stdout) => {
        if (err) return console.error("❌ Cannot fetch GPU info.");
        console.log("🎮 GPU Info:\n", stdout);
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

// Get File Path
function fetchPath(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    const filePath = path.resolve(file);
    console.log(`📂 Full path: ${filePath}`);
}


function openFile(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    console.log(`📂 Opening ${file}...`);
    exec(`start "" "${file}"`);
}


function scratches() {
    console.log("🐾 Yayy purr purr 🐱");
}


function sleepMushie() {
    console.log("😴 Mushie is now in her sleepy slumber... will wake up after reboot or 'mushie wake up'.");
    exec("taskkill /IM electron.exe /F", (err) => {
        if (err) console.log("❌ Failed to stop pop-up.");
    });
}

// Wake Up Mushie (Restart)
function wakeUpMushie() {
    console.log("☀️ Helloo hooman");
    exec("node main.js");
}


function createFile(filename) {
    if (!filename) return console.log("❌ Please provide a file name.");
    fs.writeFileSync(filename, "", "utf8");
    console.log(`📄 File '${filename}' created.`);
}

// Get IP Address
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

// Handle Commands
rl.on("line", (input) => {
    const [command, ...args] = input.trim().split(" ");
    const arg = args.join(" ");

    logCommand(input); 

    switch (command) {
        case "help": showHelp(); break;
        case "gpu": showGPU(); break;
        case "sysinfo": showSystemInfo(); break;
        case "ram-info": showRAMInfo(); break;
        case "fetch": fetchPath(arg); break;
        case "open": openFile(arg); break;
        case "scratches": scratches(); break;
        case "sleep": sleepMushie(); break;
        case "wake up": wakeUpMushie(); break;
        case "create": createFile(arg); break;
        case "ip": getIP(); break;
        case "web": openWebsite(arg); break;
        case "history": showHistory(); break;
        case "clear-history": clearHistory(); break;
        case "exit": 
            console.log("Bye! 👋"); 
            rl.close(); 
            process.exit(0); 
            break;
        default: 
            console.log("Unknown command. Type 'help' for options.");
    }
});
