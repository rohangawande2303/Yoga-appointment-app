"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, runTransaction } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";

interface Slot {
    slotId: string;
    date: string;
    time: string;
    isBooked: boolean;
    studentId: string | null;
}

export default function BookClassPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (date) {
            fetchSlots(date);
        }
    }, [date]);

    const fetchSlots = async (selectedDate: Date) => {
        setLoading(true);
        try {
            // Format date to ISO string (YYYY-MM-DD) for query
            // Note: In a real app, ensure timezone consistency. Here we use simple date string.
            const dateString = format(selectedDate, "yyyy-MM-dd");

            const q = query(
                collection(db, "slots"),
                where("date", "==", dateString),
                where("isBooked", "==", false)
            );

            const querySnapshot = await getDocs(q);
            const fetchedSlots: Slot[] = [];
            querySnapshot.forEach((doc) => {
                fetchedSlots.push({ slotId: doc.id, ...doc.data() } as Slot);
            });

            // Sort slots by time (simple string sort for now, ideally use proper time comparison)
            fetchedSlots.sort((a, b) => a.time.localeCompare(b.time));

            setSlots(fetchedSlots);
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast({
                title: "Error",
                description: "Failed to load available slots.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBookSlot = async () => {
        if (!selectedSlot || !user) return;

        setBookingLoading(true);
        try {
            await runTransaction(db, async (transaction) => {
                const slotRef = doc(db, "slots", selectedSlot.slotId);
                const slotDoc = await transaction.get(slotRef);

                if (!slotDoc.exists()) {
                    throw "Slot does not exist!";
                }

                if (slotDoc.data().isBooked) {
                    throw "Slot is already booked!";
                }

                // Create booking
                const bookingRef = doc(collection(db, "bookings"));
                transaction.set(bookingRef, {
                    bookingId: bookingRef.id,
                    studentId: user.uid,
                    slotId: selectedSlot.slotId,
                    date: selectedSlot.date,
                    time: selectedSlot.time,
                    status: "upcoming",
                    createdAt: new Date().toISOString(),
                });

                // Update slot
                transaction.update(slotRef, {
                    isBooked: true,
                    studentId: user.uid
                });
            });

            toast({
                title: "Booking Confirmed!",
                description: `You are booked for ${selectedSlot.time} on ${format(new Date(selectedSlot.date), "MMMM d, yyyy")}.`,
            });

            setIsDialogOpen(false);
            if (date) fetchSlots(date); // Refresh slots

        } catch (error: any) {
            console.error("Booking error:", error);
            toast({
                title: "Booking Failed",
                description: typeof error === 'string' ? error : "Could not complete booking. Please try again.",
                variant: "destructive",
            });
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="container p-4 md:p-8">
            <h1 className="mb-6 text-2xl font-bold">Book a Class</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Date</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Available Slots</CardTitle>
                            {date && <p className="text-sm text-muted-foreground">{format(date, "EEEE, MMMM d, yyyy")}</p>}
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {slots.map((slot) => (
                                        <Dialog key={slot.slotId} open={isDialogOpen && selectedSlot?.slotId === slot.slotId} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (open) setSelectedSlot(slot);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-auto flex-col py-4 hover:bg-primary hover:text-primary-foreground">
                                                    <Clock className="mb-2 h-4 w-4" />
                                                    <span>{slot.time}</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Confirm Booking</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to book this class?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{format(new Date(slot.date), "MMMM d, yyyy")}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{slot.time}</span>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                                    <Button onClick={handleBookSlot} disabled={bookingLoading}>
                                                        {bookingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                        Confirm Booking
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <p>No available slots for this date.</p>
                                    <p className="text-sm">Please try another date.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
