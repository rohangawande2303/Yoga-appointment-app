"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: "/student", label: "Home", icon: Home },
        { href: "/student/about", label: "About", icon: Info },
        { href: "/student/blog", label: "Blog", icon: BookOpen },
        { href: "/student/profile", label: "Profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 md:hidden">
            <div className="flex justify-around">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 p-2 text-xs transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
