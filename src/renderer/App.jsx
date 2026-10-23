

import Sidebar from "./components/Sidebar.jsx";
import StatCard from "./components/StatCard.jsx";
import SystemInfo from "./components/SystemInfo.jsx";

function App() {
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

          <button className="refresh-button" disabled>
            ↻ Refresh
          </button>
        </header>

        <section className="stats-grid">
          <StatCard
            title="CPU Cores"
            value="—"
            subtitle="Waiting for system API"
            icon="◈"
          />

          <StatCard
            title="Memory Usage"
            value="—"
            subtitle="Waiting for system API"
            icon="▤"
          />

          <StatCard
            title="System Uptime"
            value="—"
            subtitle="Waiting for system API"
            icon="◷"
          />
        </section>

        <SystemInfo />

        <footer className="app-footer">
          <span>System Desk</span>
          <span>Commit 2 · Dashboard UI</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
