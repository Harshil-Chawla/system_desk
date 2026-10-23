
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">S</div>
        <span>System Desk</span>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav>
        <a className="nav-item active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>

        <a className="nav-item" href="#system">
          <span>◈</span> System Information
        </a>

        <a className="nav-item" href="#about">
          <span>ⓘ</span> About
        </a>
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        Desktop app running
      </div>
    </aside>
  );
}

export default Sidebar;
