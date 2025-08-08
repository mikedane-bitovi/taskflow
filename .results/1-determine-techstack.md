# Tech Stack Analysis

## Core Technology Analysis

### Programming Language(s)
- **TypeScript** - Primary language for all application code
- **JavaScript** - Some configuration files and scripts
- **SQL** - Database schema and migrations with Prisma

### Primary Framework
- **Next.js 15.4.6** - React-based full-stack web application framework with App Router
- **React 19.1.0** - UI library for building component-based interfaces

### Secondary/Tertiary Frameworks & Libraries
- **Prisma 6.13.0** - Database ORM and migration tool with SQLite database
- **Tailwind CSS 4** - Utility-first CSS framework for styling
- **Radix UI** - Headless component library for accessible UI primitives
  - Avatar, Checkbox, Dialog, Dropdown Menu, Label, Select, Slot components
- **Recharts 3.1.2** - Chart library for data visualization
- **@hello-pangea/dnd 18.0.1** - Drag and drop library for Kanban board functionality
- **date-fns 4.1.0** - Date utility library
- **Lucide React 0.537.0** - Icon library
- **bcryptjs 3.0.2** - Password hashing

### State Management Approach
- **React Server Components** - Server-side rendering and data fetching
- **React hooks** (useState, useEffect, useOptimistic, useTransition) - Client-side state management
- **Prisma Client** - Database state and queries
- **Form actions** - Server actions for form submissions and mutations

## Domain Specificity Analysis

### Problem Domain
**Task/Project Management Application** - A comprehensive task management platform similar to Jira or Asana, designed for team collaboration and project tracking.

### Core Business Concepts
- **Task Management** - Create, assign, update, and track tasks with priority levels
- **User Management** - User authentication, profiles, and team organization
- **Project Workflow** - Task status progression (Todo → In Progress → Review → Done)
- **Team Collaboration** - Task assignment, user roles, and team statistics
- **Analytics & Reporting** - Task completion metrics, performance tracking, and data visualization

### User Interaction Types
- **Task CRUD Operations** - Create, read, update, delete tasks with rich forms
- **Kanban Board Interface** - Drag-and-drop task management with visual columns
- **Dashboard Analytics** - Interactive charts and metrics visualization
- **Authentication Workflows** - Login/signup with session management
- **Team Management** - User profiles, team member invitation and management
- **Search & Filtering** - Task discovery and organization tools

### Primary Data Types and Structures
- **Task Entity** - Core data model with properties: id, name, description, priority, status, dueDate, assigneeId, creatorId, timestamps
- **User Entity** - User profiles with authentication: id, email, password, name, sessions, task relationships
- **Session Entity** - Authentication sessions with token-based auth
- **Relational Data** - Many-to-many relationships between users and tasks (assignee/creator patterns)
- **Chart Data Structures** - Aggregated analytics data for visualization components

## Application Boundaries

### Features/Functionality Within Scope
- Task lifecycle management (create, assign, update, complete, delete)
- User authentication and session management
- Kanban board drag-and-drop interface
- Dashboard with analytics and metrics
- Team management and user profiles
- Task filtering and search capabilities
- Data visualization with charts and graphs
- Responsive design for mobile and desktop

### Architecturally Inconsistent Features
- **Real-time collaboration** - No WebSocket or real-time infrastructure present
- **File attachments** - No file upload or storage system implemented
- **External integrations** - No API client patterns for third-party services
- **Advanced permissions** - Simple user model without roles/permissions system
- **Notifications** - No notification system or email integration
- **Time tracking** - No time logging or hour tracking functionality
- **Advanced reporting** - Limited to basic charts, no complex report generation

### Specialized Libraries and Domain Constraints
- **Prisma ORM** - Constrains database operations to Prisma patterns and SQLite
- **Radix UI** - Ensures accessibility compliance and consistent component behavior
- **@hello-pangea/dnd** - Specific drag-and-drop implementation for Kanban boards
- **Recharts** - Limits data visualization to chart types supported by this library
- **Next.js App Router** - Route organization follows app directory structure
- **Tailwind CSS** - Styling approach limited to utility classes and design system tokens
