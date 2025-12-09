"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import {
    LayoutDashboard,
    User,
    LogOut,
    Bell,
    Edit2,
    CalendarCheck,
    Coins,
    UserCircle,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Sidebar navigation
    const sidebarItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
        { icon: User, label: "My Profile", href: "/student/profile", active: true },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // 1. Bookings
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where("userId", "==", user.uid)
                );
                const bookingsSnap = await getDocs(bookingsQuery);
                const fetchedBookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Client side sort
                fetchedBookings.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBookings(fetchedBookings);

                // 2. Announcements (Notifications)
                // In a real app, maybe filter by "audience: 'all' | 'student'"
                const announcementsQuery = query(
                    collection(db, "announcements"),
                    // orderBy("sentAt", "desc"), // Requires index
                    limit(10)
                );
                const announcementsSnap = await getDocs(announcementsQuery);
                const fetchedAnnouncements = announcementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Client side sort
                fetchedAnnouncements.sort((a: any, b: any) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
                setNotifications(fetchedAnnouncements);

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoadingBookings(false);
            }
        };

        fetchData();
    }, [user]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-transparent text-foreground animate-in fade-in duration-500 pb-20">
            {/* Header Section (Profile Specific) */}
            <div className="bg-card border-b border-white/5">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-1.5 rounded-lg">
                            <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg">Zenith Yoga</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-3 ml-4">
                            {/* Notification Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <div className="relative cursor-pointer">
                                        <Bell className="h-5 w-5 hover:text-white transition-colors" />
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                                        )}
                                    </div>
                                </SheetTrigger>
                                <SheetContent className="bg-slate-900 border-slate-800 text-slate-50">
                                    <SheetHeader className="mb-6">
                                        <SheetTitle className="text-white">Notifications</SheetTitle>
                                        <SheetDescription className="text-slate-400">
                                            Latest updates from the studio.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="space-y-4">
                                        {notifications.length > 0 ? notifications.map((note) => (
                                            <div key={note.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-white text-sm">{note.title}</h4>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                                                        {note.sentAt ? format(new Date(note.sentAt), "MMM d") : ""}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    {note.message}
                                                </p>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-center text-slate-500 py-4">No new notifications.</p>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "S"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* User Card */}
                        <div className="bg-card rounded-2xl p-6 border border-white/5 text-center shadow-lg relative overflow-hidden group">
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 relative">
                                <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border-4 border-card shadow-xl">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary/90 p-1.5 rounded-full text-white cursor-pointer hover:bg-primary transition-colors">
                                    <Edit2 className="h-3 w-3" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-white mb-1">{user.displayName || "Student"}</h3>
                            <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Member</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                        </div>

                        {/* Navigation */}
                        <div className="bg-card rounded-2xl p-4 border border-white/5 shadow-lg">
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                            item.active
                                                ? "bg-primary text-white shadow-md shadow-blue-500/20"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 mr-3" />
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-white/5">
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Header & CTA */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
                                <p className="text-muted-foreground">Manage your details and view your class journey.</p>
                            </div>
                            <Link href="/student/book">
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-blue-500/20">
                                    + Book a Class
                                </Button>
                            </Link>
                        </div>

                        {/* Personal Information Form */}
                        <div className="bg-card rounded-2xl border border-white/5 p-8 shadow-lg">
                            <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input defaultValue={user.displayName || ""} placeholder="Your Name" className="pl-10 bg-slate-900/50 border-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input defaultValue={user.email || ""} disabled className="pl-10 bg-slate-900/50 border-white/10 opacity-70" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex items-center justify-center text-xs">+91</span>
                                        <Input placeholder="Enter phone" className="pl-10 bg-slate-900/50 border-white/10" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button>Save Changes</Button>
                            </div>
                        </div>

                        {/* Past Classes */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">My Classes</h2>
                            </div>

                            {loadingBookings ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    Loading your history...
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="bg-card rounded-xl border border-white/5 p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-card/80 transition-colors group gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-slate-800 rounded-lg p-2 text-center min-w-[60px]">
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                                        {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                                                    </div>
                                                    <div className="text-lg font-bold text-white">
                                                        {new Date(booking.date).getDate()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{booking.class}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.time} • w/ {booking.teacher}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 justify-between md:justify-end">
                                                <span className="font-bold text-white">₹{booking.price}</span>
                                                <Badge variant="outline" className={cn(
                                                    "border-none",
                                                    booking.status === 'upcoming'
                                                        ? "bg-blue-500/10 text-blue-500"
                                                        : "bg-green-500/10 text-green-500"
                                                )}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-card rounded-xl border border-white/5 p-12 text-center">
                                    <CalendarCheck className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Classes Booked Yet</h3>
                                    <p className="text-muted-foreground mb-6">It looks like you haven't started your journey with us yet.</p>
                                    <Link href="/student/book">
                                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                                            Book Your First Class
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
