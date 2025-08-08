# TaskFlow

A modern task management application built with Next.js 14, React, TypeScript, and Prisma. TaskFlow provides a comprehensive solution for managing tasks, teams, and projects with an intuitive drag-and-drop Kanban board interface.

## Features

- 🎯 **Task Management**: Create, edit, and organize tasks with priorities and due dates
- 📋 **Kanban Board**: Drag-and-drop interface for visual task management
- 👥 **Team Collaboration**: User management and task assignment
- 📊 **Analytics Dashboard**: Track productivity metrics and team performance
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode**: Full dark mode support throughout the application
- 🔐 **Authentication**: Secure user authentication and session management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Drag & Drop**: @hello-pangea/dnd
- **Styling**: Tailwind CSS
- **Authentication**: Custom session-based auth with bcryptjs

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create and migrate the database
   npx prisma db push
   ```
   
   *Note: The Prisma client is automatically generated during `npm install`, so no manual generation is needed.*

4. **Seed the database** (optional but recommended)
   ```bash
   npm run db:seed
   ```
   
   This will create sample users and tasks for testing. Default login credentials:
   - Email: `alice@example.com`
   - Password: `password123`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### Available Scripts

- `npm run db:seed` - Populate the database with sample data
- `npm run db:clear` - Clear all data from the database
- `npm run db:reset` - Clear and re-seed the database

### Sample Data

The seed script creates:
- **7 sample users** with different roles and profiles
- **30+ sample tasks** with various priorities, statuses, and assignments
- **Realistic task data** including descriptions, due dates, and assignments

### Database Schema

The application uses a simple but effective schema:

- **Users**: Store user accounts with authentication
- **Sessions**: Manage user sessions and authentication tokens
- **Tasks**: Core task entities with assignments, priorities, and status tracking

## Project Structure

```
taskflow/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── *.tsx            # Business logic components
├── lib/                 # Utilities and types
├── prisma/             # Database schema and seeds
└── public/             # Static assets
```

## Key Features Explained

### Kanban Board
- Drag and drop tasks between columns (Todo, In Progress, Review, Done)
- Real-time updates using server actions
- Keyboard accessibility support

### Task Management
- Create tasks with rich descriptions
- Set priorities (Low, Medium, High, Critical)
- Assign due dates and team members
- Track task status and progress

### Analytics
- Team performance metrics
- Task completion rates
- Priority distribution charts
- Productivity trends over time

### Authentication
- Secure password hashing with bcryptjs
- Session-based authentication
- Protected routes and middleware

## Development

### Adding New Features

This project follows established patterns documented in `.github/copilot-instructions.md`. When adding new features:

1. Follow the file categorization patterns
2. Use established architectural domains
3. Implement proper TypeScript interfaces
4. Use shadcn/ui components as building blocks
5. Follow server action patterns for data mutations

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Prisma for database operations
- Server actions for data mutations

## Deployment

The application can be deployed on any platform that supports Next.js:

- **Vercel**: Easiest deployment option
- **Netlify**: Alternative hosting platform
- **Railway**: For full-stack applications
- **Docker**: Self-hosted deployment

For database hosting, consider:
- **Vercel Postgres**: For Vercel deployments
- **PlanetScale**: MySQL-compatible serverless database
- **Railway**: Integrated database hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established code patterns
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
