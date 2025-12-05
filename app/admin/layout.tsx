"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Users, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Skip layout for login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    useEffect(() => {
        if (!loading) {
            if (!user || user.email !== "admin@yoga.com") {
                setIsAuthorized(false);
                router.push("/admin/unauthorized");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // Will redirect to unauthorized page
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/admin/login");
    };

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/slots", label: "Slot Management", icon: Calendar },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
        { href: "/admin/students", label: "Students", icon: Users },
    ];

    const NavContent = () => (
        <div className="flex flex-col space-y-4 py-4">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Admin Panel
                </h2>
                <div className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="px-3 py-2 mt-auto">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r bg-card md:block">
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <NavContent />
                    </SheetContent>
                </Sheet>
                <span className="ml-4 font-bold">Admin Panel</span>
            </header>

            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
