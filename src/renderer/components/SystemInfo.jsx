
function SystemInfo({ systemInfo }) {
  const details = [
    ["Device Name", systemInfo.deviceName],
    ["Operating System", systemInfo.operatingSystem],
    ["Platform", systemInfo.platform],
    ["Architecture", systemInfo.architecture],
    ["CPU Model", systemInfo.cpu.model],
    ["Logical CPU Cores", systemInfo.cpu.cores],
    ["Total Memory", `${systemInfo.memory.totalGB} GB`],
    ["Free Memory", `${systemInfo.memory.freeGB} GB`]
  ];

  return (
    <div className="system-info-grid">
      {details.map(([label, value]) => (
        <div className="info-item" key={label}>
          <span className="info-label">{label}</span>
          <span className="info-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default SystemInfo;
