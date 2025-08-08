# Server Actions Style Guide

## Unique Conventions

### File Organization Pattern
Server Actions are organized by feature with specific naming conventions:

```tsx
// app/login/actions.ts - Authentication actions
// app/signup/actions.ts - Registration actions  
// app/(dashboard)/tasks/actions.ts - Task management actions
```

### Server Directive Placement
All Server Action files start with "use server" directive:

```tsx
"use server";

// Imports after directive
import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
```

### Prisma Client Instantiation
Each action file creates its own Prisma client instance:

```tsx
const prisma = new PrismaClient();
```

### Authentication Integration Pattern
Actions consistently check authentication before database operations:

```tsx
export async function createTask(formData: FormData) {
    // Extract form data first
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    // Authentication check
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };
    
    const creatorId = user.id;
    
    // Validation
    if (!name) return { error: "Title is required.", success: false, message: "Title is required." };
    
    // Database operation
}
```

### FormData Extraction Convention
Form data is extracted with explicit type casting:

```tsx
const name = formData.get("title") as string;
const description = formData.get("description") as string;
const priority = formData.get("priority") as string;
const assigneeIdRaw = formData.get("assigneeId") as string;
const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;
```

### Return Object Standardization
Actions return consistent object structures:

```tsx
// Success pattern
return { success: true, message: "Operation successful." };

// Error pattern  
return { error: "Error message", success: false, message: "Error message" };
```

### Error Handling Convention
Database operations use try-catch with consistent error responses:

```tsx
try {
    await prisma.task.create({
        data: {
            name,
            description,
            priority,
            status,
            dueDate: dueDate ? parseDateString(dueDate) : null,
            assigneeId,
            creatorId,
        },
    });

    revalidatePath("/tasks");
    return { success: true, message: "Task created successfully." };
} catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task.", success: false, message: "Failed to create task." };
}
```

### Revalidation Pattern
Actions trigger specific path revalidation after successful operations:

```tsx
revalidatePath("/tasks");
revalidatePath("/board");  
revalidatePath("/");
```

### Cookie Management
Authentication actions use specific cookie configuration:

```tsx
cookies().set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

### Password Security Pattern
Password operations use bcryptjs with consistent configuration:

```tsx
import bcrypt from "bcryptjs";

// Hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const valid = await bcrypt.compare(password, user.password);
```

### Session Management Convention
Session operations include proper cleanup:

```tsx
// Session creation
const sessionToken = randomBytes(32).toString("hex");
await prisma.session.create({
    data: {
        token: sessionToken,
        userId: user.id,
    },
});

// Session cleanup on logout
if (sessionToken) {
    await prisma.session.deleteMany({
        where: { token: sessionToken },
    });
}
cookies().delete("session");
```

### Date Handling Integration
Actions use custom date utilities for consistent date handling:

```tsx
import { parseDateString } from "@/lib/date-utils";

dueDate: dueDate ? parseDateString(dueDate) : null,
```

### Validation Pattern
Server-side validation is performed before database operations:

```tsx
if (!email) return { error: "Email is required." };
if (!password) return { error: "Password is required." };
if (!name) return { error: "Title is required.", success: false, message: "Title is required." };
```
