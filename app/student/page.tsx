"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, Flower, Users } from "lucide-react";

export default function StudentDashboard() {

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[85vh] md:h-[800px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-slate-900/50 relative">
                        <Image
                            src="/hero-image.jpg"
                            alt="Yoga Hero"
                            fill
                            priority
                            className="object-cover opacity-60 mix-blend-overlay"
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                target.parentElement?.classList.add(
                                    "bg-gradient-to-b",
                                    "from-slate-900",
                                    "to-slate-800"
                                );
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.6 }}
                        variants={fadeIn}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-sm">
                            Find Your Inner Balance
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Reconnect with your body and mind through our expert-led Vinyasa, Hatha, and meditation sessions.
                        </p>
                        <Link href="/student/book">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg">
                                Start Your Journey
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-card p-8 rounded-2xl text-center border border-white/5"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary mx-auto">
                                <Flower className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Expert Instructor</h3>
                            <p className="text-muted-foreground">
                                Learn from a certified master with years of experience.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-card p-8 rounded-2xl text-center border border-white/5"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary mx-auto">
                                <Clock className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
                            <p className="text-muted-foreground">
                                Classes from sunrise to sunset to fit your busy life.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-card p-8 rounded-2xl text-center border border-white/5"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary mx-auto">
                                <Users className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Community Focus</h3>
                            <p className="text-muted-foreground">
                                Join a supportive group of like-minded individuals.
                            </p>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Upcoming Classes */}
            <section className="py-20 bg-background/50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-bold">Upcoming Classes</h2>
                        <Link href="/student/book" className="text-primary font-medium">
                            View All
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Morning Vinyasa", level: "Intermediate", time: "Today, 10:00 AM", instructor: "Sarah Jenkins", price: "500", image: "/class-1.jpg" },
                            { title: "Power Flow", level: "Advanced", time: "Today, 12:00 PM", instructor: "Sarah Jenkins", price: "500", image: "/class-2.jpg" },
                            { title: "Restorative Night", level: "Beginner", time: "Today, 07:00 PM", instructor: "Sarah Jenkins", price: "500", image: "/class-3.jpg" }
                        ].map((cls, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-2xl overflow-hidden border border-white/5"
                            >
                                <div className="h-48 relative">
                                    <Image
                                        src={cls.image}
                                        alt={cls.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <Badge className="absolute top-4 left-4 bg-black/50 text-white border-none">
                                        {cls.level}
                                    </Badge>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4">{cls.title}</h3>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4 mr-2" />
                                            {cls.time}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="h-4 w-4 mr-2" />
                                            with {cls.instructor}
                                        </div>
                                    </div>
                                    <Link href="/student/book">
                                        <Button className="w-full bg-secondary hover:bg-secondary/80 text-white">
                                            Book Slot (₹{cls.price})
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24 bg-background text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
                <p className="text-muted-foreground">
                    Choose the plan that&apos;s right for you.
                </p>
            </section>

        </div>
    );
}
