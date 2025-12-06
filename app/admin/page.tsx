"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        todayBookings: 0,
        upcomingClasses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Total Students
                const studentsSnap = await getDocs(collection(db, "students"));
                const totalStudents = studentsSnap.size;

                // Today's Bookings
                const today = new Date().toISOString().split('T')[0];
                const bookingsQ = query(collection(db, "bookings"), where("date", "==", today));
                const bookingsSnap = await getDocs(bookingsQ);
                const todayBookings = bookingsSnap.size;

                // Upcoming Classes (Slots that are booked and in future)
                // This might be expensive if many slots, but for now:
                // We can query bookings with status 'upcoming'
                const upcomingQ = query(collection(db, "bookings"), where("status", "==", "upcoming"));
                const upcomingSnap = await getDocs(upcomingQ);
                const upcomingClasses = upcomingSnap.size;

                setStats({ totalStudents, todayBookings, upcomingClasses });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats.todayBookings}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingClasses}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Schedule List here if needed */}
        </div>
    );
}
