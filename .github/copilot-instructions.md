# GitHub Copilot Instructions

## Overview

This file enables AI coding assistants to generate features aligned with the project's architecture and style. It is based only on actual, observed patterns from the codebase — not invented practices.

This is a **Next.js 14 task management application** built with React, TypeScript, Prisma, and shadcn/ui components. The application follows a feature-based architecture with clear separation between UI components, server actions, and data models.

## File Category Reference

### React Pages
**Purpose**: Top-level page components that define route handlers and coordinate data fetching
**Examples**: 
- `app/(dashboard)/page.tsx`
- `app/login/page.tsx`

**Key Conventions**:
- Use Next.js 14 App Router with file-based routing
- Place pages in `app/` directory with route groups for organization
- Default export the page component
- Use Server Components for data fetching when possible
- Coordinate with server actions for mutations

### React Layouts
**Purpose**: Shared layout components that wrap pages and provide consistent structure
**Examples**:
- `app/layout.tsx`
- `app/(dashboard)/layout.tsx`

**Key Conventions**:
- Follow Next.js layout nesting patterns
- Root layout includes global providers (ThemeProvider)
- Dashboard layout includes Sidebar and Header components
- Use proper TypeScript typing with `children: React.ReactNode`
- Handle both authenticated and unauthenticated states

### React Components
**Purpose**: Reusable UI components that implement specific business logic
**Examples**:
- `components/kanban-board.tsx`
- `components/task-overview.tsx`

**Key Conventions**:
- Use TypeScript interfaces for props with clear naming
- Follow React hooks patterns (useState, useEffect, custom hooks)
- Implement proper loading and error states
- Use shadcn/ui components as building blocks
- Include accessibility features (ARIA labels, keyboard navigation)
- Use Lucide React for consistent iconography

### UI Components
**Purpose**: Low-level, reusable design system components
**Examples**:
- `components/ui/button.tsx`
- `components/ui/card.tsx`

**Key Conventions**:
- Built with Radix UI primitives and Tailwind CSS
- Use class-variance-authority (cva) for variant management
- Include forwardRef for proper ref handling
- Follow shadcn/ui patterns and naming conventions
- Provide comprehensive prop interfaces with sensible defaults

### Server Actions
**Purpose**: Server-side functions that handle data mutations and business logic
**Examples**:
- `app/login/actions.ts`
- `app/(dashboard)/tasks/actions.ts`

**Key Conventions**:
- Use "use server" directive for server actions
- Return consistent result objects with success/error states
- Include proper TypeScript typing for parameters and return values
- Handle validation and error cases gracefully
- Work with Prisma for database operations

### Type Definitions
**Purpose**: TypeScript interfaces and types for data models and component props
**Examples**:
- `lib/types.ts`
- Component prop interfaces

**Key Conventions**:
- Mirror Prisma schema types for data models
- Use clear, descriptive interface names
- Include optional properties where appropriate
- Provide union types for status enums
- Export types for reuse across components

## Feature Scaffold Guide

### Planning a New Feature
1. **Identify the domain**: Determine if it's UI-focused, data-heavy, or requires new routing
2. **Choose file categories**: Based on the feature scope, select from pages, components, actions, and types
3. **Follow naming conventions**: Use kebab-case for files, PascalCase for components
4. **Respect architectural domains**: Follow established patterns for each domain

### File Placement Rules
- **Pages**: Place in `app/` directory following Next.js App Router conventions
- **Components**: Business logic components go in `components/`, UI primitives in `components/ui/`
- **Server Actions**: Colocate with related pages in `app/` subdirectories
- **Types**: Central types in `lib/types.ts`, component-specific types inline
- **Utilities**: Helper functions in `lib/` directory

### Example: Creating a New Task Filter Component
For a task filtering feature, create:
1. `components/task-filters.tsx` - Main filter component
2. `components/ui/multi-select.tsx` - If new UI primitive needed
3. Update `lib/types.ts` - Add filter-related types
4. `app/(dashboard)/tasks/actions.ts` - Add filtering server action

## Integration Rules

### UI Domain Constraints
- All components must use shadcn/ui as the foundation
- Follow Tailwind CSS utility classes for styling
- Use Lucide React for all icons
- Implement proper accessibility patterns

### Routing Domain Constraints
- Use Next.js 14 App Router exclusively
- Organize routes with route groups for logical separation
- Follow file-based routing conventions
- Use Server Components for data fetching

### Data Layer Constraints
- All database operations must go through Prisma ORM
- Use server actions for data mutations
- Follow the established Task/User/Team schema patterns
- Include proper error handling and validation

### Authentication Domain Constraints
- Authentication state managed through server actions
- Use session-based authentication patterns
- Protect dashboard routes with proper middleware
- Handle login/logout flows consistently

### State Management Constraints
- Use React built-in state (useState, useReducer) for local state
- Leverage Server Components for server state
- Use React Context sparingly for global UI state
- Prefer server actions over client-side API calls

### Design System Constraints
- All colors, spacing, and typography must use Tailwind design tokens
- Components should support both light and dark themes
- Follow shadcn/ui component patterns and APIs
- Maintain consistency with existing visual hierarchy

### Data Visualization Constraints
- Use Recharts library for all charts and graphs
- Follow established chart styling patterns
- Implement responsive chart behaviors
- Use consistent color schemes across visualizations

### Drag and Drop Constraints
- Use @dnd-kit library for drag and drop functionality
- Implement proper keyboard accessibility
- Follow established Kanban board patterns
- Include visual feedback during drag operations

## Example Prompt Usage

**User Request**: "Create a searchable dropdown that lets users filter tasks by priority and status"

**Expected AI Response**:
```
I'll create a searchable filter dropdown component for task filtering:

1. `components/task-priority-filter.tsx` - Main filter component with search functionality
2. `components/ui/command.tsx` - Command palette component (if not exists)
3. Update `lib/types.ts` - Add TaskFilter interface
4. Update `app/(dashboard)/tasks/actions.ts` - Add filtering server action
5. Update `app/(dashboard)/tasks/page.tsx` - Integrate the filter component

The component will:
- Use shadcn/ui Command component for searchable dropdown
- Include priority options (Low, Medium, High, Critical)
- Include status options (Todo, In Progress, Done)
- Support multi-select functionality
- Follow established TypeScript patterns
- Include proper accessibility features
```

**User Request**: "Add a new team member invitation feature"

**Expected AI Response**:
```
I'll create a team member invitation feature:

1. `components/invite-team-member.tsx` - Invitation form component
2. `app/(dashboard)/team/actions.ts` - Server actions for sending invitations
3. Update `lib/types.ts` - Add Invitation interface
4. Update `prisma/schema.prisma` - Add Invitation model (if needed)
5. `components/ui/form.tsx` - Form components (if not exists)

The feature will:
- Use react-hook-form for form management
- Include email validation
- Send invitation emails through server actions
- Follow established error handling patterns
- Use shadcn/ui form components
- Include proper loading states
```

## Project-Specific Patterns

### Component Structure
```typescript
interface ComponentProps {
  // Clear prop definitions
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component implementation
}
```

### Server Action Pattern
```typescript
"use server"

export async function actionName(data: ActionData) {
  try {
    // Database operation
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: "Error message" }
  }
}
```

### Type Definition Pattern
```typescript
export interface ModelName {
  id: string
  // Other properties
  createdAt: Date
  updatedAt: Date
}
```

This instruction file ensures that any AI assistant can generate features that seamlessly integrate with the existing codebase architecture and conventions.
