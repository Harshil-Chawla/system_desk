
function SystemInfo() {
  const details = [
    { label: "Device Name", value: "Awaiting connection" },
    { label: "Operating System", value: "Awaiting connection" },
    { label: "CPU Model", value: "Awaiting connection" },
    { label: "Architecture", value: "Awaiting connection" },
    { label: "Total Memory", value: "Awaiting connection" },
    { label: "Application", value: "System Desk" }
  ];

  return (
    <section className="panel" id="system">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SYSTEM DETAILS</p>
          <h2>Device information</h2>
        </div>

        <span className="connection-status">
          Frontend preview
        </span>
      </div>

      <div className="info-grid">
        {details.map((item) => (
          <div className="info-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SystemInfo;
