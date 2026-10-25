
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">SD</div>
        <div>
          <h2>System Desk</h2>
          <p>Desktop Monitor</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <span>▦</span>
          Overview
        </div>

        <div className="nav-item">
          <span>▤</span>
          System Information
        </div>
      </nav>

      <div className="sidebar-bottom">
        <span className="status-indicator" />
        <span>Desktop application</span>
      </div>
    </aside>
  );
}

export default Sidebar;
