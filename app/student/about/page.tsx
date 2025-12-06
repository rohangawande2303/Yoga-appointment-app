"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container p-4 md:p-8 max-w-6xl mx-auto">
            {/* Teacher Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full bg-primary/30 flex items-center justify-center">
                                <Heart className="w-24 h-24 text-primary" />
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h1 className="text-3xl font-bold mb-2">Meet Your Instructor</h1>
                            <p className="text-xl text-primary mb-4">Sarah Johnson</p>
                            <p className="text-muted-foreground mb-6">
                                With over 10 years of experience in yoga instruction, Sarah brings a unique blend of traditional wisdom and modern techniques to help you achieve your wellness goals. Her teaching philosophy centers on making yoga accessible to everyone, regardless of age or fitness level.
                            </p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm">
                                    <Mail className="w-4 h-4 mr-2 text-primary" />
                                    <span>sarah@yogaapp.com</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Phone className="w-4 h-4 mr-2 text-primary" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                                    <span>Mumbai, India</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Link href="https://facebook.com" target="_blank">
                                    <Button variant="outline" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                                        <Facebook className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="https://instagram.com" target="_blank">
                                    <Button variant="outline" size="icon" className="hover:bg-pink-50 hover:text-pink-600">
                                        <Instagram className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="https://twitter.com" target="_blank">
                                    <Button variant="outline" size="icon" className="hover:bg-sky-50 hover:text-sky-600">
                                        <Twitter className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* About Yoga Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">About Yoga</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">What is Yoga?</h3>
                            <p className="text-muted-foreground">
                                Yoga is an ancient practice that combines physical postures, breathing techniques, and meditation to promote overall health and well-being. It&apos;s a holistic approach to wellness that benefits both body and mind.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Our Approach</h3>
                            <p className="text-muted-foreground">
                                We believe in personalized instruction that meets you where you are. Whether you&apos;re a complete beginner or an experienced practitioner, our classes are designed to challenge and inspire you.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Benefits of Regular Practice</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Physical Health", desc: "Improve flexibility, strength, and posture" },
                        { title: "Mental Clarity", desc: "Reduce stress and enhance focus" },
                        { title: "Emotional Balance", desc: "Cultivate inner peace and mindfulness" },
                        { title: "Better Sleep", desc: "Promote relaxation and restful sleep" },
                        { title: "Increased Energy", desc: "Boost vitality and overall wellness" },
                        { title: "Community", desc: "Connect with like-minded individuals" }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                        >
                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-12"
            >
                <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Join our classes and start your journey towards better health, peace of mind, and overall well-being.
                </p>
                <Link href="/student/book">
                    <Button size="lg" className="shadow-lg">
                        Book a Class Now
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
