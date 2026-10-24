
const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("node:os");
const path = require("node:path");

function formatBytes(bytes) {
  return Number((bytes / (1024 ** 3)).toFixed(2));
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "System Desk",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL("http://localhost:5173");
}

// Commit 3: test the secure IPC connection.
ipcMain.handle("system:ping", () => {
  return {
    success: true,
    message: "Secure IPC connection is working!"
  };
});

// Commit 4: return real system information.
ipcMain.handle("system:get-info", () => {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const uptimeSeconds = os.uptime();

  return {
    deviceName: os.hostname(),
    operatingSystem: `${os.type()} ${os.release()}`,
    platform: os.platform(),
    architecture: os.arch(),

    cpu: {
      model: cpus[0]?.model ?? "Unknown",
      cores: cpus.length
    },

    memory: {
      totalGB: formatBytes(totalMemory),
      usedGB: formatBytes(usedMemory),
      freeGB: formatBytes(freeMemory),
      usedPercent: Math.round((usedMemory / totalMemory) * 100)
    },

    uptime: formatUptime(uptimeSeconds)
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
