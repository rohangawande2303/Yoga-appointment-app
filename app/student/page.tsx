"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";


export default function StudentDashboard() {
    const { user } = useAuth();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container p-4 md:p-8 max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user?.displayName?.split(" ")[0] || "Student"}!</h1>
                <p className="text-muted-foreground text-lg">Ready for your yoga session?</p>
                <div className="mt-6">
                    <Link href="/student/book">
                        <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                            <Calendar className="mr-2 h-5 w-5" />
                            Book Your Class
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 mb-8"
            >
                <motion.div variants={item}>
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Calendar className="mr-2 h-5 w-5 text-primary" />
                                Upcoming Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">No upcoming classes scheduled.</p>
                                <Link href="/student/book">
                                    <Button variant="outline">Book Your First Class</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Sparkles className="mr-2 h-5 w-5 text-accent" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">No past classes yet.</p>
                                <Link href="/student/profile">
                                    <Button variant="outline">View Profile</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary/5 rounded-lg p-8 mb-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Why Practice Yoga?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Flexibility", desc: "Improve your range of motion and reduce stiffness" },
                        { title: "Strength", desc: "Build muscle tone and core stability" },
                        { title: "Mindfulness", desc: "Reduce stress and cultivate inner peace" }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="text-center p-4"
                        >
                            <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-4">Start Your Journey Today</h3>
                        <p className="text-muted-foreground mb-6">Join our community and experience the transformative power of yoga</p>
                        <Link href="/student/about">
                            <Button variant="outline" size="lg">
                                Learn More About Us
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
