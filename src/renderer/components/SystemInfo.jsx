
function SystemInfo({ systemInfo }) {
  const details = [
    {
      label: "Device Name",
      value: systemInfo?.deviceName ?? "Loading..."
    },
    {
      label: "Operating System",
      value: systemInfo?.operatingSystem ?? "Loading..."
    },
    {
      label: "CPU Model",
      value: systemInfo?.cpu.model ?? "Loading..."
    },
    {
      label: "Architecture",
      value: systemInfo?.architecture ?? "Loading..."
    },
    {
      label: "Total Memory",
      value: systemInfo
        ? `${systemInfo.memory.totalGB} GB`
        : "Loading..."
    },
    {
      label: "Application",
      value: "System Desk"
    }
  ];

  return (
    <section className="panel" id="system">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SYSTEM DETAILS</p>
          <h2>Device information</h2>
        </div>

        <span className="connection-status">
          {systemInfo ? "Connected" : "Loading"}
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
