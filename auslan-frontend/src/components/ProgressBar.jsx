export default function ProgressBar({ value = 0, total = 100 }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      <span className="progress-text">{value}/{total} ({pct}%)</span>
    </div>
  );
}
