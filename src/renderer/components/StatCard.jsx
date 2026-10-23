
function StatCard({ title, value, subtitle, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card-header">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <h2>{value}</h2>

      <p>{subtitle}</p>
    </article>
  );
}

export default StatCard;
