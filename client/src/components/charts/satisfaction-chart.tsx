import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SatisfactionData {
  name: string;
  value: number;
  color: string;
}

interface SatisfactionChartProps {
  data: SatisfactionData[];
  height?: number;
}

export function SatisfactionChart({ data, height = 200 }: SatisfactionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ 
            background: "hsl(var(--card))", 
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
