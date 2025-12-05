"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Loader2, Mail, Phone, Calendar, Clock, History } from "lucide-react";
import { motion } from "framer-motion";

interface StudentData {
    name: string;
    email: string;
    phone: string;
    joinedAt: string;
}

interface Booking {
    bookingId: string;
    date: string;
    time: string;
    status: "upcoming" | "completed" | "cancelled";
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const docRef = doc(db, "students", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStudentData(docSnap.data() as StudentData);
                }

                // Fetch booking history
                const q = query(
                    collection(db, "bookings"),
                    where("studentId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const fetchedBookings: Booking[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedBookings.push(doc.data() as Booking);
                });
                fetchedBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBookings(fetchedBookings);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container max-w-4xl p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="mb-2 text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account and view your class history</p>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Profile Card */}
                <motion.div variants={item}>
                    <Card className="overflow-hidden border-none shadow-lg">
                        <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-32 w-full"></div>
                        <CardContent className="relative pt-0">
                            <div className="-mt-12 mb-4 flex justify-center md:justify-start">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={user?.photoURL || ""} />
                                    <AvatarFallback className="text-2xl bg-primary/20">{studentData?.name?.charAt(0) || "S"}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="text-center md:text-left mb-6">
                                <h2 className="text-2xl font-bold">{studentData?.name}</h2>
                                <p className="text-muted-foreground">Yoga Student</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center space-x-3 rounded-lg border p-3 bg-card hover:bg-accent/5 transition-colors">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium">{studentData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-3 bg-card hover:bg-accent/5 transition-colors">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="text-sm font-medium">{studentData?.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-3 bg-card hover:bg-accent/5 transition-colors">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Joined</p>
                                        <p className="text-sm font-medium">
                                            {studentData?.joinedAt ? format(new Date(studentData.joinedAt), "MMMM d, yyyy") : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-3 bg-card hover:bg-accent/5 transition-colors">
                                    <History className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Classes</p>
                                        <p className="text-sm font-medium">{bookings.length}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Booking History Card */}
                <motion.div variants={item}>
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <History className="mr-2 h-5 w-5 text-primary" />
                                Booking History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div
                                            key={booking.bookingId}
                                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/5 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="rounded-full bg-primary/10 p-3">
                                                    <Calendar className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM d, yyyy")}</p>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {booking.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    booking.status === "upcoming"
                                                        ? "default"
                                                        : booking.status === "completed"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No booking history found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
