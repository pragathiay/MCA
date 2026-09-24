import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const data = [
  { month: "Jan", income: 2800, expenses: 1900 },
  { month: "Feb", income: 3200, expenses: 2100 },
  { month: "Mar", income: 3000, expenses: 2500 },
  { month: "Apr", income: 3800, expenses: 2300 },
  { month: "May", income: 3500, expenses: 2700 },
  { month: "Jun", income: 4200, expenses: 2600 },
  { month: "Jul", income: 3900, expenses: 2900 },
];
export function SpendingChart() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-[15px] font-bold text-ink">
            Cash flow
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Your income and expenses over time
          </p>
        </div>
        <select className="rounded-lg border border-line bg-white px-2 py-1.5 text-[11px] font-semibold text-muted outline-none">
          <option>Last 7 months</option>
        </select>
      </div>
      <div className="mt-7 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#66c48e" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#66c48e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f39a83" stopOpacity={0.17} />
                <stop offset="100%" stopColor="#f39a83" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#edf1ef" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9aa7a1", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9aa7a1", fontSize: 10 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e8eeeb",
                borderRadius: 10,
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#4caf7b"
              strokeWidth={2.5}
              fill="url(#incomeFill)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ee8c77"
              strokeWidth={2.5}
              fill="url(#expenseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-center gap-5 text-[11px] font-semibold text-muted">
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-[#4caf7b]" />
          Income
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-[#ee8c77]" />
          Expenses
        </span>
      </div>
    </div>
  );
}
