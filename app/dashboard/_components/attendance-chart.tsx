"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { day: string; bookings: number; attended: number };

export function AttendanceChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="g-booked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f5141" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3f5141" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-attended" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45f4a" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#b45f4a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebe7e0" vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            stroke="#a8a29e"
            fontSize={11}
            tick={{ fontFamily: "var(--font-sans)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#a8a29e"
            fontSize={11}
            allowDecimals={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #ebe7e0",
              boxShadow: "0 4px 12px rgba(28,25,23,0.06)",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              padding: "8px 12px",
            }}
            cursor={{ stroke: "#d6d3d1", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="bookings"
            name="Booked"
            stroke="#3f5141"
            strokeWidth={2}
            fill="url(#g-booked)"
          />
          <Area
            type="monotone"
            dataKey="attended"
            name="Attended"
            stroke="#b45f4a"
            strokeWidth={2}
            fill="url(#g-attended)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
