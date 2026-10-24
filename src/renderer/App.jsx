
import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import StatCard from "./components/StatCard.jsx";
import SystemInfo from "./components/SystemInfo.jsx";

function App() {
  const [connectionMessage, setConnectionMessage] = useState(
    "Connection not tested yet"
  );
  const [testing, setTesting] = useState(false);

  async function testConnection() {
    setTesting(true);

    try {
      const result = await window.systemAPI.ping();

      setConnectionMessage(result.message);
    } catch (error) {
      console.error("IPC test failed:", error);
      setConnectionMessage("Connection failed. Check the terminal.");
    } finally {
      setTesting(false);
    }
  }

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
            onClick={testConnection}
            disabled={testing}
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </header>

        <section className="stats-grid">
          <StatCard
            title="CPU Cores"
            value="—"
            subtitle="Coming in Commit 4"
            icon="◈"
          />

          <StatCard
            title="Memory Usage"
            value="—"
            subtitle="Coming in Commit 4"
            icon="▤"
          />

          <StatCard
            title="System Uptime"
            value="—"
            subtitle="Coming in Commit 4"
            icon="◷"
          />
        </section>

        <SystemInfo />

        <section className="panel" style={{ marginTop: "20px" }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">ELECTRON CONNECTION</p>
              <h2>Secure IPC Test</h2>
            </div>
          </div>

          <p className="muted">{connectionMessage}</p>
        </section>

        <footer className="app-footer">
          <span>System Desk</span>
          <span>Commit 3 · Secure IPC</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

