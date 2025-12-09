"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Flower, Users, CheckCircle2 } from "lucide-react";

export default function StudentDashboard() {
    const { user } = useAuth();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[85vh] md:h-[800px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Placeholder for Hero Image */}
                    <div className="w-full h-full bg-slate-900/50 relative">
                        {/* Replace with /hero-yoga.jpg when available */}
                        <img
                            src="/hero-image.jpg"
                            alt="Yoga Hero"
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                            onError={(e) => {
                                // Fallback if image missing: Just a nice gradient
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('bg-gradient-to-b', 'from-slate-900', 'to-slate-800');
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
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-1">
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
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-card p-8 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-primary/20 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <Flower className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Expert Instructor</h3>
                            <p className="text-muted-foreground">Learn from a certified master with years of experience.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-card p-8 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-primary/20 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <Clock className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
                            <p className="text-muted-foreground">Classes from sunrise to sunset to fit your busy life.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-card p-8 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-primary/20 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <Users className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Community Focus</h3>
                            <p className="text-muted-foreground">Join a supportive group of like-minded individuals.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Upcoming Classes */}
            <section className="py-20 bg-background/50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-bold">Upcoming Classes</h2>
                        <Link href="/student/book" className="text-primary hover:text-primary/80 font-medium">
                            View All
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Class Card 1 */}
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
                                className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 group"
                            >
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    <img
                                        src={cls.image}
                                        alt={cls.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('bg-slate-800'); }}
                                    />
                                    <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white border-none">
                                        {cls.level}
                                    </Badge>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{cls.title}</h3>
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
                                        <Button className="w-full bg-secondary hover:bg-secondary/80 text-white font-medium">
                                            Book Slot (₹{cls.price})
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
                        <p className="text-muted-foreground">Choose the plan that's right for you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Single Class */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card p-10 rounded-3xl border border-white/5"
                        >
                            <h3 className="text-xl font-semibold text-primary mb-2">Single Class</h3>
                            <div className="text-4xl font-bold mb-4">₹500</div>
                            <p className="text-muted-foreground text-sm mb-8">Perfect for trying out a class or for a drop-in session.</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                                    Access to one group class
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                                    Valid for 14 days
                                </li>
                            </ul>
                            <Button className="w-full bg-secondary hover:bg-secondary/80" variant="secondary">
                                Choose Plan
                            </Button>
                        </motion.div>

                        {/* Monthly Pass */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-primary p-10 rounded-3xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <h3 className="text-xl font-semibold text-white mb-2">Monthly Pass</h3>
                            <div className="text-4xl font-bold text-white mb-4">₹4,000</div>
                            <p className="text-blue-100 text-sm mb-8">Best value for regular practitioners. Access to all our classes.</p>

                            <ul className="space-y-4 mb-8 text-white">
                                <li className="flex items-center text-sm">
                                    <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                    </div>
                                    Unlimited group classes
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                    </div>
                                    Access to special workshops
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                    </div>
                                    Valid for 30 days
                                </li>
                            </ul>
                            <Button className="w-full bg-white text-primary hover:bg-white/90">
                                Choose Plan
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>


        </div>
    );
}
