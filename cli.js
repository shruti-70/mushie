#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { networkInterfaces } = require("os");
const electron = require("electron");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("🐱 Mushie CLI Ready! Type 'help' for commands.");

const logFilePath = path.join(__dirname, "logs.txt");
const sleepFile = path.join(__dirname, "mushie_state.txt");

function logCommand(command) {
    fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ${command}\n`, "utf8");
}

function showGPU() {
    exec("wmic path win32_VideoController get name", (err, stdout) => {
        if (err) return console.error("❌ Cannot fetch GPU info.");
        console.log("🎮 GPU Info:\n", stdout);
    });
}

function fetchPath(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    console.log(`🔍 Searching for "${file}"... (May take a while)`);

    const searchCommand = process.platform === "win32"
        ? `dir /s /b C:\\ | findstr /i "${file}"`
        : `find / -name "${file}" 2>/dev/null`;

    exec(searchCommand, (err, stdout) => {
        if (err || !stdout.trim()) console.log(`❌ File not found: ${file}`);
        else console.log(`📂 Found:\n${stdout.trim()}`);
    });
}

function showSystemInfo() {
    console.log(`🖥️ OS: ${os.type()} ${os.release()}`);
    console.log(`⚙️ CPU: ${os.cpus()[0].model}`);
    console.log(`💾 RAM: ${(os.totalmem() / 1e9).toFixed(2)} GB`);
}

function openFile(file) {
    if (!file) return console.log("❌ Please provide a file name.");
    file = file.replace(/^"(.*)"$/, "$1");
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) return console.log(`❌ File not found: ${filePath}`);

    console.log(`📂 Opening ${filePath}...`);
    const openCommand = process.platform === "win32" ? `start "" "${filePath}"` : `open "${filePath}"`;
    exec(openCommand, (err) => {
        if (err) console.log("❌ Failed to open file.");
    });
}

function sleepMushie() {
    fs.writeFileSync(sleepFile, "sleep", "utf8");
    console.log("😴 Mushie is now sleeping.");
}

function wakeUpMushie() {
    if (fs.existsSync(sleepFile)) fs.unlinkSync(sleepFile);
    console.log("☀️ Mushie is awake!");
}

function showPopup() {
    if (fs.existsSync(sleepFile)) {
        console.log("😴 Mushie is sleeping! No pop-ups.");
        return;
    }
    console.log("🐱 Showing Mushie popup...");
    const child = spawn(electron, [path.join(__dirname, "main.js")], { detached: true, stdio: "ignore" });
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
  sysinfo          - Show system info
  fetch <file>     - Find a file
  open <file>      - Open a file
  sleep            - Stop pop-ups
  wake up          - Resume pop-ups
  popup            - Show Mushie popup
  exit             - Close CLI
`);
            break;
        case "gpu": showGPU(); break;
        case "sysinfo": showSystemInfo(); break;
        case "fetch": fetchPath(arg); break;
        case "open": openFile(arg); break;
        case "sleep": sleepMushie(); break;
        case "wake": if (args[0] === "up") wakeUpMushie(); showPopup(); break;
        case "popup": showPopup(); break;
        case "exit": console.log("Bye! 👋"); rl.close(); process.exit(0); break;
        default: console.log("Unknown command. Type 'help' for options.");
    }
});
