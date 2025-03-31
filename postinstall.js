#!/usr/bin/env node

console.log("🐱 Starting Mushie Cat popup after installation...");

const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');

// Start Electron with our main.js file
const child = spawn(electron, [path.join(__dirname, 'main.js')], {
  detached: true, 
  stdio: 'ignore'
});


child.unref();

console.log("🐱 Mushie has been installed! The popup should appear shortly.");
console.log("🐱 You can run the 'mushie' command anytime to access the CLI.");