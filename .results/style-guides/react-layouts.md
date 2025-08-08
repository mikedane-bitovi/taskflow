# React Layouts Style Guide

## Unique Conventions

### Nested Layout Hierarchy
This project uses a specific two-tier layout system with distinct responsibilities:

```tsx
// app/layout.tsx - Root layout with global styles and metadata
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

// app/(dashboard)/layout.tsx - Authentication and navigation layout
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
        </div>
    );
}
```

### Authentication Guard Integration
Dashboard layout implements authentication as a layout concern rather than page-level:

```tsx
// Authentication check at layout level
const user = await getCurrentUser();
if (!user) redirect("/login");
```

### Font Integration Pattern
Root layout includes custom font integration through Next.js font optimization:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Applied in body className
className={`${inter.className} bg-background text-foreground`}
```

### Fixed Sidebar Layout
Dashboard layout uses a specific flex-based layout with fixed sidebar:

```tsx
<div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
</div>
```

### Overflow Management
Specific overflow handling for full-screen application layout:
- Container: `h-screen overflow-hidden`
- Sidebar: Fixed width, no overflow
- Main content: `overflow-x-hidden overflow-y-auto`

### Route Group Organization
Layout structure supports route group organization:
- Root layout: Global concerns (styles, fonts, metadata)
- Dashboard layout: Protected route concerns (auth, navigation)
- Individual pages: Content-specific concerns

### Metadata Convention
Root layout includes specific metadata structure:

```tsx
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};
```

### Background Color Strategy
Layouts establish semantic background colors through Tailwind classes:
- Root: `bg-background text-foreground` for theme consistency
- Dashboard main: `bg-background` for content areas
