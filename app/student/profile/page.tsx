"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
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

/* ---------------- TYPES ---------------- */

type Booking = {
    id: string;
    date: string;
    time: string;
    teacher: string;
    class: string;
    price: number;
    status: "upcoming" | "completed";
};

type Notification = {
    id: string;
    title: string;
    message: string;
    sentAt: string;
};

/* ---------------- PAGE ---------------- */

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
        { icon: User, label: "My Profile", href: "/student/profile", active: true },
    ];

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                /* ----------- BOOKINGS ----------- */
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where("userId", "==", user.uid)
                );

                const bookingsSnap = await getDocs(bookingsQuery);

                const fetchedBookings: Booking[] = bookingsSnap.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        date: data.date,
                        time: data.time,
                        teacher: data.teacher,
                        class: data.class,
                        price: data.price,
                        status: data.status,
                    };
                });

                fetchedBookings.sort(
                    (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                );

                setBookings(fetchedBookings);

                /* ----------- NOTIFICATIONS ----------- */
                const announcementsQuery = query(
                    collection(db, "announcements"),
                    limit(10)
                );

                const announcementsSnap = await getDocs(announcementsQuery);

                const fetchedAnnouncements: Notification[] =
                    announcementsSnap.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title,
                            message: data.message,
                            sentAt: data.sentAt,
                        };
                    });

                fetchedAnnouncements.sort(
                    (a, b) =>
                        new Date(b.sentAt).getTime() -
                        new Date(a.sentAt).getTime()
                );

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">

            {/* Header */}
            <div className="bg-card border-b border-white/5">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-1.5 rounded-lg">
                            <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold">Zenith Yoga</span>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="relative">
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                        </SheetTrigger>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Notifications</SheetTitle>
                                <SheetDescription>
                                    Latest updates from the studio.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-4">
                                {notifications.length > 0 ? (
                                    notifications.map((note) => (
                                        <div key={note.id} className="bg-muted p-4 rounded-xl">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-semibold">{note.title}</h4>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(note.sentAt), "MMM d")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {note.message}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground">
                                        No new notifications.
                                    </p>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid lg:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-2xl text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="Profile"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <UserCircle className="w-full h-full text-muted-foreground" />
                            )}
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                                <Edit2 className="h-3 w-3" />
                            </div>
                        </div>

                        <h3 className="font-bold">{user.displayName || "Student"}</h3>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>

                    <div className="bg-card p-4 rounded-2xl">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-xl",
                                    item.active
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={() => logout()}
                            className="flex w-full items-center mt-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main */}
                <div className="lg:col-span-3 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Classes</h1>
                    </div>

                    {loadingBookings ? (
                        <div className="text-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-card p-4 rounded-xl flex justify-between">
                                    <div>
                                        <h3 className="font-bold">{booking.class}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.time} • w/ {booking.teacher}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">₹{booking.price}</div>
                                        <Badge variant="outline">{booking.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-xl">
                            <CalendarCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="mb-4">
                                You haven&apos;t booked any classes yet.
                            </p>
                            <Link href="/student/book">
                                <Button>Book Your First Class</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
