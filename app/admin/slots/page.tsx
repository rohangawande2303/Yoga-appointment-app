"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Trash2, Plus, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Slot {
    slotId: string;
    date: string;
    time: string;
    isBooked: boolean;
    studentId: string | null;
}

const MORNING_SLOTS = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
const EVENING_SLOTS = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

function getNext7Days() {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date);
    }
    return days;
}

export default function SlotManagementPage() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDefaultDialogOpen, setIsDefaultDialogOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
    const [generating, setGenerating] = useState(false);
    const { toast } = useToast();

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "slots"));
            const querySnapshot = await getDocs(q);
            const fetchedSlots: Slot[] = [];
            querySnapshot.forEach((doc) => {
                fetchedSlots.push({ slotId: doc.id, ...doc.data() } as Slot);
            });
            fetchedSlots.sort((a, b) => {
                const dateA = new Date(a.date + " " + a.time);
                const dateB = new Date(b.date + " " + b.time);
                return dateB.getTime() - dateA.getTime();
            });
            setSlots(fetchedSlots);
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleAddSlot = async () => {
        try {
            if (!newDate || !newTime) return;

            await addDoc(collection(db, "slots"), {
                date: newDate,
                time: newTime,
                isBooked: false,
                studentId: null
            });

            toast({ title: "Slot added successfully" });
            setIsDialogOpen(false);
            setNewDate("");
            setNewTime("");
            fetchSlots();
        } catch (error) {
            console.error("Error adding slot:", error);
            toast({ title: "Error adding slot", variant: "destructive" });
        }
    };

    const handleGenerateDefaultSlots = async () => {
        if (selectedDays.length === 0 || selectedTimeSlots.length === 0) {
            toast({ title: "Please select at least one day and time slot", variant: "destructive" });
            return;
        }

        setGenerating(true);
        try {
            const batch = writeBatch(db);
            let count = 0;

            selectedDays.forEach(dayIndex => {
                const date = getNext7Days()[parseInt(dayIndex)];
                const dateString = format(date, "yyyy-MM-dd");

                selectedTimeSlots.forEach(time => {
                    const slotRef = doc(collection(db, "slots"));
                    batch.set(slotRef, {
                        date: dateString,
                        time: time,
                        isBooked: false,
                        studentId: null
                    });
                    count++;
                });
            });

            await batch.commit();
            toast({ title: `${count} slots generated successfully!` });
            setIsDefaultDialogOpen(false);
            setSelectedDays([]);
            setSelectedTimeSlots([]);
            fetchSlots();
        } catch (error) {
            console.error("Error generating slots:", error);
            toast({ title: "Error generating slots", variant: "destructive" });
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteSlot = async (id: string) => {
        if (confirm("Are you sure you want to delete this slot?")) {
            try {
                await deleteDoc(doc(db, "slots", id));
                toast({ title: "Slot deleted" });
                fetchSlots();
            } catch (error) {
                console.error("Error deleting slot:", error);
            }
        }
    };

    const next7Days = getNext7Days();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Slot Management</h1>
                    <p className="text-muted-foreground mt-1">Manage class schedules and availability</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDefaultDialogOpen} onOpenChange={setIsDefaultDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Sparkles className="mr-2 h-4 w-4" /> Quick Generate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Generate Weekly Slots</DialogTitle>
                                <DialogDescription>Select days and times to generate slots for the next week</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Select Days</Label>
                                    <div className="grid grid-cols-7 gap-2">
                                        {next7Days.map((date, index) => {
                                            const dayName = format(date, "EEE");
                                            const dateStr = format(date, "MMM d");
                                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                            return (
                                                <div key={index} className="flex flex-col items-center">
                                                    <Checkbox
                                                        id={`day-${index}`}
                                                        checked={selectedDays.includes(index.toString())}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedDays([...selectedDays, index.toString()]);
                                                            } else {
                                                                setSelectedDays(selectedDays.filter(d => d !== index.toString()));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`day-${index}`} className={`text-xs mt-1 cursor-pointer ${isWeekend ? 'text-muted-foreground' : ''}`}>
                                                        <div className="font-medium">{dayName}</div>
                                                        <div className="text-xs">{dateStr}</div>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Select Time Slots</Label>
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-sm text-muted-foreground mb-2 block">Morning (6 AM - 12 PM)</Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {MORNING_SLOTS.map((time) => (
                                                    <div key={time} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`time-${time}`}
                                                            checked={selectedTimeSlots.includes(time)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedTimeSlots([...selectedTimeSlots, time]);
                                                                } else {
                                                                    setSelectedTimeSlots(selectedTimeSlots.filter(t => t !== time));
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`time-${time}`} className="text-sm cursor-pointer">{time}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground mb-2 block">Evening (4 PM - 7 PM)</Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {EVENING_SLOTS.map((time) => (
                                                    <div key={time} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`time-${time}`}
                                                            checked={selectedTimeSlots.includes(time)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedTimeSlots([...selectedTimeSlots, time]);
                                                                } else {
                                                                    setSelectedTimeSlots(selectedTimeSlots.filter(t => t !== time));
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`time-${time}`} className="text-sm cursor-pointer">{time}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleGenerateDefaultSlots} disabled={generating}>
                                    {generating ? "Generating..." : `Generate ${selectedDays.length * selectedTimeSlots.length} Slots`}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Single Slot</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Slot</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Date</Label>
                                    <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Time (e.g. 10:00 AM)</Label>
                                    <Input type="text" placeholder="10:00 AM" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSlot}>Save Slot</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Slots</CardTitle>
                    <CardDescription>View and manage all class slots</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slots.map((slot) => (
                                    <TableRow key={slot.slotId}>
                                        <TableCell className="font-medium">{format(new Date(slot.date), "EEE, MMM d, yyyy")}</TableCell>
                                        <TableCell>{slot.time}</TableCell>
                                        <TableCell>
                                            {slot.isBooked ? (
                                                <Badge variant="secondary">Booked</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteSlot(slot.slotId)}
                                                className="hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {slots.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No slots found. Click "+ Add Single Slot" or "Quick Generate" to create slots.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
