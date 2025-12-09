"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
            {/* Instructor Profile Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-white/5 p-8 md:p-12 relative max-w-4xl mx-auto">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
                                <img
                                    src="/instructor-sarah.jpg"
                                    alt="Sarah Jenkins"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-slate-700', 'flex', 'items-center', 'justify-center');
                                        e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">SJ</span>';
                                    }}
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-primary rounded-full p-1.5 border-4 border-card">
                                <Badge className="bg-transparent p-0 hover:bg-transparent shadow-none border-none">
                                    <span className="sr-only">Verified</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                </Badge>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-1 text-white">Sarah Jenkins</h1>
                        <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">Lead Instructor</p>

                        <p className="text-muted-foreground text-center max-w-lg mb-8 leading-relaxed">
                            Certified Vinyasa Instructor | 500hr RYT.
                            Guiding students towards mindfulness, strength, and inner peace for over a decade.
                            My classes focus on breath-work and finding your unique flow.
                        </p>

                        <div className="flex gap-4">
                            <Button variant="secondary" size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10">
                                <Mail className="h-5 w-5" />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Our Philosophy</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        We believe yoga is for everyone. Our practice is rooted in traditional Hatha and Vinyasa styles,
                        adapted for modern life to help you disconnect from noise and reconnect with yourself.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Stress Relief", desc: "Unwind after a busy day with calming sequences designed to lower cortisol.", icon: "🌿" },
                        { title: "Flexibility", desc: "Improve your range of motion and physical health through consistent practice.", icon: "🤸" },
                        { title: "Community", desc: "Join a supportive group of like-minded individuals on the same journey.", icon: "👥" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all hover:-translate-y-1"
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-card rounded-2xl p-8 md:p-12 border border-white/5">
                    <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                    <p className="text-muted-foreground mb-8">Simple 3-step process to get you on the mat.</p>

                    <div className="relative border-l border-primary/20 ml-4 pl-8 space-y-12">
                        {[
                            { step: "1", title: "Browse the Calendar", desc: "Check our weekly schedule for a time that suits your rhythm." },
                            { step: "2", title: "Reserve your Mat", desc: "Select your preferred spot and book instantly. Slots fill up fast!" },
                            { step: "3", title: "Join the Flow", desc: "Arrive 10 minutes early and prepare to transform your day." }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[45px] top-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-16 max-w-3xl">
                <h2 className="text-2xl font-bold mb-8">Common Questions</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-white/10 rounded-lg px-4 bg-card/50">
                        <AccordionTrigger className="hover:no-underline text-white font-medium py-4">
                            <div className="flex items-center text-left">
                                <span className="mr-3 text-primary">?</span>
                                What should I bring?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            We provide mats, blocks, and straps. Just bring comfortable clothing, a water bottle, and an open mind.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border border-white/10 rounded-lg px-4 bg-card/50">
                        <AccordionTrigger className="hover:no-underline text-white font-medium py-4">
                            <div className="flex items-center text-left">
                                <span className="mr-3 text-primary">?</span>
                                What is the cancellation policy?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            You can cancel up to 2 hours before class for a full refund. Late cancellations are non-refundable.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border border-white/10 rounded-lg px-4 bg-card/50">
                        <AccordionTrigger className="hover:no-underline text-white font-medium py-4">
                            <div className="flex items-center text-left">
                                <span className="mr-3 text-primary">?</span>
                                Can beginners join?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            Absolutely! We welcome all levels. Look for classes marked 'Beginner' or 'All Levels'.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 mb-16">
                <div className="bg-primary rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-blue-600 to-purple-600 opacity-90" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h2>
                        <p className="text-blue-100 mb-8 max-w-lg mx-auto">Book your first class today and experience the difference.</p>
                        <Link href="/student/book">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 rounded-full">
                                View Schedule
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
