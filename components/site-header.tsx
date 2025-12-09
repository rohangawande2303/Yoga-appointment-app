"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Flower, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    const links = [
        { href: "/student/about", label: "About" },
        { href: "/student/blog", label: "Blog" },
    ];

    const isAdmin = user?.email === "admin@yoga.com";

    // Zenith Yoga Logo
    const Logo = () => (
        <Link
            href="/student"
            className="flex items-center space-x-2 text-primary hover:opacity-90 transition-opacity"
        >
            <Flower className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-white">
                Zenith Yoga
            </span>
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Logo />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link href="/student/book">
                        <Button className="font-semibold bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                            Book Now
                        </Button>
                    </Link>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-card border-border"
                            >
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-border" />

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/student/profile"
                                        className="cursor-pointer"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>

                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/admin"
                                                className="cursor-pointer text-primary"
                                            >
                                                <Shield className="mr-2 h-4 w-4" />
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator className="bg-border" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-500 focus:text-red-500"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </nav>

                {/* Mobile Right Action (no hamburger) */}
                <div className="md:hidden flex items-center gap-4">
                    <Link href="/student/book">
                        <Button
                            size="sm"
                            className="font-semibold bg-primary hover:bg-primary/90 text-white rounded-full"
                        >
                            Book
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
