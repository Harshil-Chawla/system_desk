
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const os = require("node:os");
const path = require("node:path");
const { writeFile } = require("node:fs/promises");

function formatBytes(bytes) {
  return Number((bytes / (1024 ** 3)).toFixed(2));
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function getCpuTimes() {
  return os.cpus().map((cpu) => ({
    idle: cpu.times.idle,
    total: Object.values(cpu.times).reduce(
      (sum, time) => sum + time,
      0
    )
  }));
}

// Compare two CPU readings to estimate CPU usage.
function calculateCpuUsage(previous, current) {
  if (!previous || previous.length !== current.length) {
    return null;
  }

  let totalIdleDifference = 0;
  let totalTimeDifference = 0;

  for (let i = 0; i < current.length; i++) {
    const idleDifference = current[i].idle - previous[i].idle;
    const timeDifference = current[i].total - previous[i].total;

    totalIdleDifference += idleDifference;
    totalTimeDifference += timeDifference;
  }

  if (totalTimeDifference <= 0) {
    return 0;
  }

  const usage =
    (1 - totalIdleDifference / totalTimeDifference) * 100;

  return Math.round(Math.max(0, Math.min(100, usage)));
}

function getSystemInfo(cpuUsage = null) {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  return {
    deviceName: os.hostname(),
    operatingSystem: `${os.type()} ${os.release()}`,
    platform: os.platform(),
    architecture: os.arch(),

    cpu: {
      model: cpus[0]?.model ?? "Unknown",
      cores: cpus.length,
      usagePercent: cpuUsage
    },

    memory: {
      totalGB: formatBytes(totalMemory),
      usedGB: formatBytes(usedMemory),
      freeGB: formatBytes(freeMemory),
      usedPercent: Math.round((usedMemory / totalMemory) * 100)
    },

    uptime: formatUptime(os.uptime())
  };
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 850,
    minHeight: 600,
    title: "System Desk",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL("http://localhost:5173");
}

ipcMain.handle("system:ping", () => ({
  success: true,
  message: "Secure IPC connection is working!"
}));

// Keep the previous CPU reading between requests.
let previousCpuTimes = getCpuTimes();

ipcMain.handle("system:get-info", () => {
  const currentCpuTimes = getCpuTimes();
  const cpuUsage = calculateCpuUsage(
    previousCpuTimes,
    currentCpuTimes
  );

  previousCpuTimes = currentCpuTimes;

  return getSystemInfo(cpuUsage);
});

ipcMain.handle("system:export-report", async (event) => {
  const senderUrl = event.senderFrame?.url;

  if (!senderUrl) {
    throw new Error("Could not verify the IPC sender.");
  }

  let senderOrigin;

  try {
    senderOrigin = new URL(senderUrl).origin;
  } catch {
    throw new Error("Invalid IPC sender URL.");
  }

  if (senderOrigin !== "http://localhost:5173") {
    throw new Error("Untrusted IPC sender.");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    ...getSystemInfo()
  };

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Export System Report",
    defaultPath: path.join(
      app.getPath("documents"),
      "system-report.json"
    ),
    filters: [
      { name: "JSON Report", extensions: ["json"] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  const finalPath = filePath.toLowerCase().endsWith(".json")
    ? filePath
    : `${filePath}.json`;

  await writeFile(
    finalPath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  return { success: true, filePath: finalPath };
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
