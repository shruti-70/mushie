#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("🐱 Setting up Mushie Cat...");

// Create a startup script that will run the application
const isWindows = process.platform === 'win32';
const homeDir = os.homedir();
const scriptName = isWindows ? 'start-mushie.bat' : 'start-mushie.sh';
const scriptPath = path.join(homeDir, scriptName);

// Create the content for the starter script
let scriptContent;
if (isWindows) {
  scriptContent = `@echo off
echo Starting Mushie Cat...
start "" "%APPDATA%\\npm\\node_modules\\mushie-cat\\launcher.js"
`;
} else {
  scriptContent = `#!/bin/bash
echo "Starting Mushie Cat..."
node ~/.npm-global/lib/node_modules/mushie-cat/launcher.js &
`;
}


fs.writeFileSync(scriptPath, scriptContent);


const launcherPath = path.join(__dirname, 'launcher.js');
const launcherContent = `#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');

console.log("🐱 Launching Mushie Cat...");

// Start Electron with our main.js file
const child = spawn(electron, [path.join(__dirname, 'main.js')], {
  detached: true, 
  stdio: 'ignore'
});

// Unreference the child to allow the parent process to exit
child.unref();
`;

fs.writeFileSync(launcherPath, launcherContent);
if (!isWindows) {
  // Make launcher executable on Unix 
  fs.chmodSync(launcherPath, '755');
  fs.chmodSync(scriptPath, '755');
}

console.log(`🐱 Mushie Cat has been installed! To start Mushie's popup feature, run:`);
console.log(`- Windows: ${scriptPath}`);
console.log(`- macOS/Linux: bash ${scriptPath}`);
console.log(`You can also use the 'mushie' command to access the CLI features.`);