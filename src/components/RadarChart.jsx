import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function RadarChart({ radar, title }) {
  const data = [
    { axis: 'R&D', value: radar.rnd || 0, fullMark: 10 },
    { axis: 'Stabilité', value: radar.stabilite || 0, fullMark: 10 },
    { axis: 'Image', value: radar.image || 0, fullMark: 10 },
    { axis: 'Efficacité', value: radar.efficacite || 0, fullMark: 10 },
  ];

  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="rgba(201, 168, 76, 0.2)" />
          <PolarAngleAxis dataKey="axis" stroke="rgba(201, 168, 76, 0.5)" />
          <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="rgba(201, 168, 76, 0.3)" />
          <Radar name="Valeur" dataKey="value" stroke="#c9a84c" fill="rgba(201, 168, 76, 0.3)" />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
