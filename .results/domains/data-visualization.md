# Data Visualization Domain Analysis

## Overview
The data visualization domain is built entirely on Recharts library, providing consistent chart styling that matches the application's design system and responsive behavior across all chart components.

## Chart Library Architecture

### Recharts Foundation
All charts use Recharts as the single data visualization library:

```tsx
// From components/dashboard-charts.tsx
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function DashboardCharts({ data }: { data: TaskStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#072427",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey="total" name="Total Tasks" fill="#F5532C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#00848B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

## Responsive Chart Design

### ResponsiveContainer Pattern
All charts use ResponsiveContainer for responsive behavior:

```tsx
// Consistent responsive wrapper
<ResponsiveContainer width="100%" height={350}>
  {/* Chart content */}
</ResponsiveContainer>

// Height variations for different chart types
<ResponsiveContainer width="100%" height={300}> // For analytics charts
```

## Chart Styling Patterns

### Design System Integration
Charts use colors that match the application's design system:

```tsx
// From app/(dashboard)/analytics/page.tsx
const COLORS = ['#BCECEF', '#4BBEC5', '#00848B', '#F5532C', '#8dd1e1', '#d084d0'];

// Color mapping for different chart elements
<Bar dataKey="total" name="Total Tasks" fill="#F5532C" radius={[4, 4, 0, 0]} />
<Bar dataKey="completed" name="Completed" fill="#00848B" radius={[4, 4, 0, 0]} />
```

### Consistent Tooltip Styling
Tooltips are styled to match the application theme:

```tsx
<Tooltip
  cursor={{ fill: "transparent" }}
  contentStyle={{
    backgroundColor: "#072427",
    borderColor: "hsl(var(--border))",
  }}
/>
```

### Axis Styling
Consistent axis styling across all charts:

```tsx
<XAxis 
  dataKey="month" 
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
/>
```

## Chart Types Implementation

### Bar Charts
Bar charts for comparative data:

```tsx
// From dashboard charts
<BarChart data={data}>
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend wrapperStyle={{ fontSize: "14px" }} />
  <Bar dataKey="total" name="Total Tasks" fill="#F5532C" radius={[4, 4, 0, 0]} />
  <Bar dataKey="completed" name="Completed" fill="#00848B" radius={[4, 4, 0, 0]} />
</BarChart>
```

### Pie Charts
Pie charts for distribution data:

```tsx
// From analytics page
<PieChart>
  <Pie
    data={statusChartData}
    cx="50%"
    cy="50%"
    outerRadius={100}
    fill="#F5532C"
    dataKey="value"
    label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
  >
    {statusChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip cursor={{ fill: "transparent" }} />
</PieChart>
```

## Data Structure Patterns

### Chart Data Interface
Consistent data structure interfaces for charts:

```tsx
// From components/dashboard-charts.tsx
interface TaskStats {
  month: string
  total: number
  completed: number
}

export function DashboardCharts({ data }: { data: TaskStats[] }) {
  // Chart implementation
}
```

### Data Transformation
Data is transformed server-side before passing to charts:

```tsx
// From app/(dashboard)/page.tsx
// Group tasks by month (YYYY-MM)
const statsMap = new Map();
for (const task of allTasks) {
  const monthKey = task.createdAt.toISOString().slice(0, 7); // YYYY-MM
  if (!statsMap.has(monthKey)) {
    statsMap.set(monthKey, { total: 0, completed: 0 });
  }
  const stats = statsMap.get(monthKey);
  stats.total++;
  if (task.status === "done") {
    stats.completed++;
  }
}

const taskStats = Array.from(statsMap.entries())
  .map(([month, stats]) => ({
    month: format(new Date(month + "-01"), "MMM yyyy"),
    ...stats,
  }))
  .sort((a, b) => a.month.localeCompare(b.month));
```

## Analytics Page Implementation

### Multiple Chart Types
Analytics page demonstrates various chart implementations:

```tsx
// From app/(dashboard)/analytics/page.tsx
return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Pie Chart for Status Distribution */}
    <div className="bg-card-background p-6 rounded-lg shadow border">
      <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* Pie chart implementation */}
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart for Priority Distribution */}
    <div className="bg-card-background p-6 rounded-lg shadow border">
      <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityChartData}>
          {/* Bar chart implementation */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
```

## Chart Container Patterns

### Card Integration
Charts are consistently wrapped in Card components:

```tsx
// Dashboard chart wrapper
<Card>
  <CardHeader>
    <CardTitle>Task Overview</CardTitle>
  </CardHeader>
  <CardContent className="pl-2">
    <ResponsiveContainer width="100%" height={350}>
      {/* Chart content */}
    </ResponsiveContainer>
  </CardContent>
</Card>

// Analytics chart wrapper
<div className="bg-card-background p-6 rounded-lg shadow border">
  <h2 className="text-xl font-semibold mb-4">Chart Title</h2>
  <ResponsiveContainer width="100%" height={300}>
    {/* Chart content */}
  </ResponsiveContainer>
</div>
```

## Performance Considerations

### Client-Side Rendering
Charts are rendered on the client side with "use client" directive:

```tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
```

### Data Processing
Data processing happens server-side before passing to chart components, keeping client-side computation minimal.

This data visualization domain ensures consistent chart styling, responsive behavior, and seamless integration with the application's design system while maintaining a single library approach for all visualization needs.
