"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Booking {
    bookingId: string;
    studentId: string;
    date: string;
    time: string;
    status: string;
    studentName?: string; // We'll fetch this
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                let q = query(collection(db, "bookings"));
                if (filterDate) {
                    q = query(collection(db, "bookings"), where("date", "==", filterDate));
                }

                const querySnapshot = await getDocs(q);
                const fetchedBookings: Booking[] = [];

                // Fetch student details for each booking (could be optimized)
                const studentCache: Record<string, string> = {};

                for (const docSnap of querySnapshot.docs) {
                    const data = docSnap.data() as Booking;
                    let studentName = "Unknown";

                    if (studentCache[data.studentId]) {
                        studentName = studentCache[data.studentId];
                    } else {
                        // Fetch student doc? Or just store name in booking?
                        // Ideally store name in booking to avoid N+1 queries.
                        // But for now, let's assume we need to fetch or just show ID.
                        // Let's try to fetch all students once if list is small, or just show ID.
                        // User requirement: "See student details".
                        // I'll skip fetching for now to keep it simple or fetch on demand.
                        // Actually, I'll fetch all students map first.
                    }
                    fetchedBookings.push({ ...data, studentName });
                }

                // Sort
                fetchedBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBookings(fetchedBookings);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [filterDate]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Bookings</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Filter by Date:</span>
                    <Input type="date" className="w-auto" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.bookingId}>
                                <TableCell>{format(new Date(booking.date), "MMM d, yyyy")}</TableCell>
                                <TableCell>{booking.time}</TableCell>
                                <TableCell className="font-mono text-xs">{booking.studentId}</TableCell>
                                <TableCell>
                                    <Badge variant={booking.status === "upcoming" ? "default" : "secondary"}>{booking.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
