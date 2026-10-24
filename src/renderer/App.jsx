
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import StatCard from "./components/StatCard.jsx";
import SystemInfo from "./components/SystemInfo.jsx";

function App() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSystemInfo() {
    setLoading(true);
    setError("");

    try {
      const result = await window.systemAPI.getInfo();
      setSystemInfo(result);
    } catch (err) {
      console.error("Failed to load system information:", err);
      setError("Unable to retrieve system information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSystemInfo();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">DESKTOP CONTROL CENTER</p>
            <h1>System Overview</h1>
            <p className="muted">
              Monitor your device from one place.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadSystemInfo}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </header>

        {error && (
          <p role="alert" className="muted">
            {error}
          </p>
        )}

        <section className="stats-grid">
          <StatCard
            title="CPU Cores"
            value={systemInfo ? systemInfo.cpu.cores : "—"}
            subtitle={
              systemInfo
                ? systemInfo.cpu.model
                : loading
                  ? "Loading system data..."
                  : "Data unavailable"
            }
            icon="◈"
          />

          <StatCard
            title="Memory Usage"
            value={
              systemInfo
                ? `${systemInfo.memory.usedPercent}%`
                : "—"
            }
            subtitle={
              systemInfo
                ? `${systemInfo.memory.usedGB} GB of ${systemInfo.memory.totalGB} GB used`
                : loading
                  ? "Loading system data..."
                  : "Data unavailable"
            }
            icon="▤"
          />

          <StatCard
            title="System Uptime"
            value={systemInfo ? systemInfo.uptime : "—"}
            subtitle="Time since system boot"
            icon="◷"
          />
        </section>

        <SystemInfo systemInfo={systemInfo} />

        <section className="panel" style={{ marginTop: "20px" }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">SYSTEM STATUS</p>
              <h2>Connection</h2>
            </div>
          </div>

          <p className="muted">
            {error
              ? error
              : systemInfo
                ? "System information retrieved successfully."
                : "Connecting to the system API..."}
          </p>
        </section>

        <footer className="app-footer">
          <span>System Desk</span>
          <span>Commit 4 · Live System Information</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
