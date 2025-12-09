"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
    Users,
    Calendar,
    Search,
    Bell,
    Megaphone,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2,
    UserPlus,
    Send
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

/* ---------------- TYPES ---------------- */

type Booking = {
    id: string;
    date?: string;
    time?: string;
    class?: string;
    teacher?: string;
    price?: number;
    userName?: string;
    createdAt?: string;
};

type Activity = Booking & {
    type?: "booking";
};
export default function AdminDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState({
        totalStudents: 0,
        todayBookingsCount: 0,
        monthlyRevenue: 0,
    });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Register Student Form
    const [studentData, setStudentData] = useState({ name: "", email: "", phone: "" });

    // Announcement Form
    const [announcementData, setAnnouncementData] = useState({ title: "", message: "" });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Stats & Revenue
            const studentsSnap = await getDocs(collection(db, "students"));
            const bookingsSnap = await getDocs(collection(db, "bookings"));

            let totalRevenue = 0;
            const todayStr = format(new Date(), "yyyy-MM-dd");
            const todayBookingsData: Booking[] = [];

            // Temporary array for all bookings to sort for "Recent Activity"
            const allBookings: Activity[] = [];

            bookingsSnap.forEach((doc) => {
                const data = doc.data();
                if (data.price) totalRevenue += Number(data.price);
                if (data.date === todayStr) todayBookingsData.push({ id: doc.id, ...data });
                allBookings.push({ id: doc.id, ...data, type: 'booking' });
            });

            // Simulate recent activity from bookings (newest first)
            // In a real app, you might have a dedicated 'activities' or 'notifications' collection
            const sortedActivity = allBookings
                .sort((a: Activity, b: Activity) =>
                    new Date(b.createdAt || b.date || "").getTime() -
                    new Date(a.createdAt || a.date || "").getTime()
                )
                .slice(0, 10);


            setStats({
                totalStudents: studentsSnap.size,
                todayBookingsCount: todayBookingsData.length,
                monthlyRevenue: totalRevenue,
            });
            setBookings(todayBookingsData);
            setRecentActivity(sortedActivity);

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStudent = async () => {
        if (!studentData.name || !studentData.email) {
            toast({ title: "Error", description: "Name and Email are required.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "students"), {
                name: studentData.name,
                email: studentData.email,
                phone: studentData.phone,
                joinedAt: new Date().toISOString(),
                status: "Active"
            });
            toast({ title: "Success", description: "Student registered successfully." });
            setIsRegisterOpen(false);
            setStudentData({ name: "", email: "", phone: "" });
            fetchDashboardData(); // Refresh stats
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to register student.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementData.title || !announcementData.message) {
            toast({ title: "Error", description: "Title and Message are required.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "announcements"), {
                title: announcementData.title,
                message: announcementData.message,
                sentAt: new Date().toISOString(),
                author: "Admin"
            });
            toast({ title: "Sent", description: "Announcement sent to all students." });
            setIsAnnouncementOpen(false);
            setAnnouncementData({ title: "", message: "" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to send announcement.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-8 font-sans">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Good Morning, Admin</h1>
                    <p className="text-slate-400">Here&apos;s what&apos;s happening at the studio today.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500 rounded-xl"
                        />
                    </div>

                    {/* Notification Sidebar */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" className="relative rounded-full hover:bg-slate-800">
                                <Bell className="h-5 w-5 text-slate-400" />
                                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-slate-950 border-slate-800 text-slate-50 overflow-y-auto w-[400px] sm:w-[540px]">
                            <SheetHeader className="mb-6">
                                <SheetTitle className="text-white">Live Updates</SheetTitle>
                                <SheetDescription className="text-slate-400">
                                    Real-time activity from your studio.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-bold text-white">{item.userName || "Student"}</span> booked <span className="text-blue-400">{item.class}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {item.createdAt ? format(new Date(item.createdAt), "MMM d, h:mm a") : "Just now"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-center text-slate-500 py-4">No recent activity.</p>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors">
                        <ChevronLeft className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">{format(new Date(), "MMM dd, yyyy")}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Students Card */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Active Students</p>
                                <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {loading ? "..." : stats.totalStudents}
                                </h3>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center text-xs">
                            <span className="text-slate-500">Registered users</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Slots Booked Card */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Slots Booked Today</p>
                                <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {loading ? "..." : stats.todayBookingsCount}
                                </h3>
                            </div>
                            <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                            </div>
                        </div>
                        <div className="flex items-center text-xs">
                            <span className="text-slate-500">For {format(new Date(), "MMM dd")}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Card */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-emerald-500/50 transition-colors group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {loading ? "..." : `₹${stats.monthlyRevenue.toLocaleString()}`}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <span className="h-5 w-5 text-emerald-500 font-bold flex items-center justify-center">₹</span>
                            </div>
                        </div>
                        <div className="flex items-center text-xs">
                            <span className="text-slate-500">Generated from all bookings</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Graph Area */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white">Revenue Snapshot</h3>
                            <p className="text-sm text-slate-400">Performance overview</p>
                        </div>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300">View Report</Button>
                    </div>

                    <div className="h-64 w-full flex items-end justify-between px-4 pb-4 relative z-10">
                        <svg className="absolute bottom-0 left-0 w-full h-48" preserveAspectRatio="none">
                            <path d="M0,150 C50,100 100,50 150,120 C200,190 250,80 300,100 C350,120 400,180 450,80 C500,-20 550,150 600,100 C650,50 700,20 750,80 C800,140 850,50 900,20 L900,200 L0,200 Z" fill="url(#gradient)" opacity="0.1" />
                            <path d="M0,150 C50,100 100,50 150,120 C200,190 250,80 300,100 C350,120 400,180 450,80 C500,-20 550,150 600,100 C650,50 700,20 750,80 C800,140 850,50 900,20" stroke="#3b82f6" strokeWidth="3" fill="none" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="flex justify-between w-full text-xs text-slate-500 mt-2 absolute bottom-0">
                            <span>WEEK 1</span>
                            <span>WEEK 2</span>
                            <span>WEEK 3</span>
                            <span>WEEK 4</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">

                            {/* Register Student Modal */}
                            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                                        <UserPlus className="h-4 w-4 mr-2" /> Register Student
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-50">
                                    <DialogHeader>
                                        <DialogTitle>Register New Student</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Add a new student to the database manually.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={studentData.name}
                                                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                                                className="bg-slate-800 border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={studentData.email}
                                                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                                                className="bg-slate-800 border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone (Optional)</Label>
                                            <Input
                                                id="phone"
                                                value={studentData.phone}
                                                onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                                                className="bg-slate-800 border-slate-700"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
                                        <Button onClick={handleRegisterStudent} disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Send Announcement Modal */}
                            <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full justify-start h-12 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl">
                                        <Megaphone className="h-4 w-4 mr-2" /> Send Announcement
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-50">
                                    <DialogHeader>
                                        <DialogTitle>Broadcast Announcement</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Send a notification to all students.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={announcementData.title}
                                                onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                                                placeholder="e.g. Class Cancelled"
                                                className="bg-slate-800 border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                value={announcementData.message}
                                                onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                                                placeholder="Enter your message here..."
                                                className="bg-slate-800 border-slate-700 h-32"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsAnnouncementOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSendAnnouncement} disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Send</>}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Schedule Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Today&apos;s Schedule</h3>
                    <Link href="/admin/slots">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                            + Add Slot
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 rounded-lg">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Time</th>
                                <th className="px-4 py-3">Class</th>
                                <th className="px-4 py-3">Teacher</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {bookings.length > 0 ? bookings.map((slot) => (
                                <tr key={slot.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">
                                        {slot.time}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-white">{slot.class}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                                            <span>{slot.teacher}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-emerald-400 font-bold">
                                        ₹{slot.price ?? 0}

                                    </td>
                                    <td className="px-4 py-4 text-slate-300">
                                        {slot.userName}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500">
                                        No bookings found for active classes today.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
