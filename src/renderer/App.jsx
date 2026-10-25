
import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import SystemInfo from "./components/SystemInfo";

function App() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [monitoring, setMonitoring] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadSystemInfo = useCallback(async () => {
    try {
      if (!window.systemAPI?.getInfo) {
        throw new Error("System API is unavailable. Restart the app.");
      }

      const info = await window.systemAPI.getInfo();

      setSystemInfo(info);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError(err.message || "Could not load system information.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load system information when the dashboard first opens.
  useEffect(() => {
    loadSystemInfo();
  }, [loadSystemInfo]);

  // Automatically refresh while monitoring is enabled.
  useEffect(() => {
    if (!monitoring) {
      return;
    }

    const intervalId = setInterval(() => {
      loadSystemInfo();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [monitoring, loadSystemInfo]);

  async function exportReport() {
    setExporting(true);
    setExportMessage("");

    try {
      if (!window.systemAPI?.exportReport) {
        throw new Error("Report export is unavailable.");
      }

      const result = await window.systemAPI.exportReport();

      if (result.canceled) {
        setExportMessage("Export cancelled.");
      } else if (result.success) {
        setExportMessage(`Report saved to: ${result.filePath}`);
      } else {
        setExportMessage("The report was not saved.");
      }
    } catch (err) {
      setExportMessage(
        `Export failed: ${err.message || "Unknown error"}`
      );
    } finally {
      setExporting(false);
    }
  }

  const cpuUsage = systemInfo?.cpu.usagePercent;
  const memoryUsage = systemInfo?.memory.usedPercent;

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SYSTEM OVERVIEW</p>
            <h1>System Desk</h1>
            <p className="muted">
              Monitor your computer in real time.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={loadSystemInfo}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              className="secondary-button"
              onClick={() => setMonitoring((previous) => !previous)}
            >
              {monitoring ? "Pause Monitoring" : "Resume Monitoring"}
            </button>

            <button
              className="primary-button"
              onClick={exportReport}
              disabled={exporting || loading || !systemInfo}
            >
              {exporting ? "Exporting..." : "Export Report"}
            </button>
          </div>
        </header>

        <div className="monitoring-status">
          <span
            className={`status-indicator ${
              monitoring ? "" : "paused"
            }`}
          />

          {monitoring
            ? "Live monitoring enabled · Refreshes every 3 seconds"
            : "Monitoring paused · Showing the last readings"}

          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button
              className="secondary-button"
              onClick={loadSystemInfo}
            >
              Try again
            </button>
          </div>
        )}

        {loading && !systemInfo && (
          <p className="status-message">
            Loading system information...
          </p>
        )}

        {systemInfo && (
          <>
            <section className="stats-grid">
              <StatCard
                title="CPU Usage"
                value={
                  cpuUsage === null
                    ? "Measuring..."
                    : `${cpuUsage ?? "—"}%`
                }
                subtitle={`${systemInfo.cpu.cores} logical processors`}
              />

              <StatCard
                title="Memory Usage"
                value={`${memoryUsage}%`}
                subtitle={`${systemInfo.memory.usedGB} GB used`}
              />

              <StatCard
                title="Total Memory"
                value={`${systemInfo.memory.totalGB} GB`}
                subtitle={`${systemInfo.memory.freeGB} GB available`}
              />

              <StatCard
                title="System Uptime"
                value={systemInfo.uptime}
                subtitle="Since the last system start"
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Live Resource Usage</h2>
                  <p className="muted">
                    Current system-wide CPU and memory estimates.
                  </p>
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label">
                  <span>CPU</span>
                  <strong>
                    {cpuUsage == null ? "Measuring..." : `${cpuUsage}%`}
                  </strong>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label="CPU usage"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={cpuUsage ?? 0}
                >
                  <div
                    className="progress-fill cpu-fill"
                    style={{ width: `${cpuUsage ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label">
                  <span>Memory</span>
                  <strong>{memoryUsage}%</strong>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label="Memory usage"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={memoryUsage}
                >
                  <div
                    className="progress-fill memory-fill"
                    style={{ width: `${memoryUsage}%` }}
                  />
                </div>
              </div>
            </section>

            <section className="panel device-panel">
              <div className="panel-heading">
                <div>
                  <h2>Device Information</h2>
                  <p className="muted">
                    Details reported by your operating system.
                  </p>
                </div>

                <span className="status-dot">Connected</span>
              </div>

              <SystemInfo systemInfo={systemInfo} />
            </section>
          </>
        )}

        {exportMessage && (
          <p className="status-message" role="status">
            {exportMessage}
          </p>
        )}

        <footer className="footer">
          System Desk · Electron + React
        </footer>
      </main>
    </div>
  );
}

export default App;
