import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface PerformanceData {
  name: string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  height?: number;
}

export function PerformanceChart({ data, height = 200 }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{ 
            background: "hsl(var(--card))", 
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
          cursor={{ fill: "rgba(124, 125, 243, 0.1)" }}
        />
        <Bar
          dataKey="value"
          fill="hsl(var(--secondary))"
          radius={4}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
