# Authentication Domain Analysis

## Overview
The authentication domain implements a custom session-based authentication system using bcryptjs for password hashing, database-stored sessions, and HTTP-only cookies for security.

## Authentication Architecture

### Session-Based Authentication
The system uses a custom session-based approach instead of JWT:

```tsx
// From app/login/actions.ts
export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Invalid email or password." };
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return { error: "Invalid email or password." };
    }
    
    // Create session
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });
    
    // Set HTTP-only cookie
    cookies().set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return { success: true };
}
```

### Password Security
Passwords are hashed using bcryptjs with default salt rounds:

```tsx
// From app/signup/actions.ts
const hashedPassword = await bcrypt.hash(password, 10);
```

## User Context Management

### Current User Retrieval
User context is retrieved through a server-side function:

```tsx
// From app/login/actions.ts
export async function getCurrentUser() {
    const sessionToken = cookies().get("session")?.value;
    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });

    if (!session) return null;
    return session.user;
}
```

### Authentication Guards
Route protection is implemented in layouts:

```tsx
// From app/(dashboard)/layout.tsx
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

## User Interface Integration

### Auth Dropdown Component
User authentication state is displayed in the UI:

```tsx
// From components/auth-dropdown.tsx
"use client"

export function AuthDropdown() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            const u = await getCurrentUser();
            if (u) setUser({ name: u.name, email: u.email });
        })();
    }, []);

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarName name={user.name} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-foreground-muted">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                {/* ... logout button */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
```

## Login Flow

### Form Handling
Login forms use Server Actions for authentication:

```tsx
// From app/login/page.tsx
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, formAction] = useActionState(loginAction, initialState);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <CheckSquare className="h-8 w-8 mr-2 text-primary" />
                        <CardTitle className="text-2xl">TaskFlow</CardTitle>
                    </div>
                    <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" action={formAction}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* ... password field and submit button */}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
```

## Logout Implementation

### Session Cleanup
Logout removes both the database session and cookie:

```tsx
// From app/login/actions.ts
export async function logout() {
    const sessionToken = cookies().get("session")?.value;
    if (sessionToken) {
        await prisma.session.deleteMany({
            where: { token: sessionToken },
        });
    }
    cookies().delete("session");
    redirect("/login");
}
```

## Registration Flow

### User Creation
New user registration with password hashing:

```tsx
// From app/signup/actions.ts
export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // Validation
    if (!email || !password || !name) {
        return { error: "All fields are required." };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "User with this email already exists." };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return { success: true };
    } catch (error) {
        return { error: "Failed to create user." };
    }
}
```

## Security Considerations

### Cookie Configuration
Cookies are configured for security:
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` (in production) - HTTPS only
- `sameSite: "lax"` - CSRF protection
- 7-day expiration

### Session Management
- Sessions are stored in the database
- Session tokens are cryptographically random
- Session cleanup on logout

This authentication domain provides secure, server-first authentication with proper session management and user context throughout the application.
