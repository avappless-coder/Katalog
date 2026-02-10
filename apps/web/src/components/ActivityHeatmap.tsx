export function ActivityHeatmap({ data }: { data: number[] }) {
  return (
    <div className="heatmap-grid">
      {data.map((value, index) => (
        <span key={index} className={`heat-cell heat-${value}`} />
      ))}
    </div>
  );
}