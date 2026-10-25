
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

  const loadSystemInfo = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.systemAPI?.getInfo) {
        throw new Error("System API is unavailable. Restart the app.");
      }

      const info = await window.systemAPI.getInfo();
      setSystemInfo(info);
    } catch (err) {
      setError(err.message || "Could not load system information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSystemInfo();
  }, [loadSystemInfo]);

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

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SYSTEM OVERVIEW</p>
            <h1>System Desk</h1>
            <p className="muted">
              Monitor your computer's system information.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={loadSystemInfo}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
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
          <p className="status-message">Loading system information...</p>
        )}

        {!loading && !error && systemInfo && (
          <>
            <section className="stats-grid">
              <StatCard
                title="CPU Cores"
                value={systemInfo.cpu.cores}
                subtitle="Logical processors"
              />

              <StatCard
                title="Memory Used"
                value={`${systemInfo.memory.usedPercent}%`}
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
          <p
            className="status-message"
            role="status"
          >
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
