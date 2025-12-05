"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Booking {
    bookingId: string;
    date: string;
    time: string;
    status: "upcoming" | "completed" | "cancelled";
}

export default function HistoryPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "bookings"),
                        where("studentId", "==", user.uid),
                        // orderBy("date", "desc") // Requires index
                    );

                    const querySnapshot = await getDocs(q);
                    const fetchedBookings: Booking[] = [];
                    querySnapshot.forEach((doc) => {
                        fetchedBookings.push(doc.data() as Booking);
                    });

                    // Sort manually if index not ready
                    fetchedBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    setBookings(fetchedBookings);
                } catch (error) {
                    console.error("Error fetching history:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-2xl p-4 md:p-8">
            <h1 className="mb-6 text-2xl font-bold">Booking History</h1>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <Card key={booking.bookingId}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                                    </div>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{booking.time}</span>
                                    </div>
                                </div>
                                <div>
                                    <Badge variant={booking.status === "upcoming" ? "default" : booking.status === "completed" ? "secondary" : "destructive"}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <p>No booking history found.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
