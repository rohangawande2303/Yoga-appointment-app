"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Essential Yoga Poses for Beginners",
        excerpt: "Start your yoga journey with these foundational poses that build strength, flexibility, and mindfulness.",
        category: "Beginner",
        readTime: "5 min read",
        date: "Dec 1, 2024",
        slug: "5-essential-yoga-poses-for-beginners",
        url: "https://www.yogajournal.com/practice/beginners/",
    },
    {
        id: 2,
        title: "The Science Behind Yoga and Stress Relief",
        excerpt: "Discover how yoga affects your nervous system and why it's one of the most effective stress-management tools.",
        category: "Wellness",
        readTime: "7 min read",
        date: "Nov 28, 2024",
        slug: "science-behind-yoga-stress-relief",
        url: "https://www.health.harvard.edu/staying-healthy/yoga-benefits-beyond-the-mat",
    },
    {
        id: 3,
        title: "Morning Yoga Routine for Energy",
        excerpt: "Wake up your body and mind with this energizing 15-minute morning yoga sequence.",
        category: "Practice",
        readTime: "4 min read",
        date: "Nov 25, 2024",
        slug: "morning-yoga-routine-energy",
        url: "https://www.yogajournal.com/practice/yoga-sequences/morning-yoga-sequence/",
    },
    {
        id: 4,
        title: "Breathing Techniques for Better Sleep",
        excerpt: "Learn pranayama techniques that can help you fall asleep faster and improve sleep quality.",
        category: "Wellness",
        readTime: "6 min read",
        date: "Nov 20, 2024",
        slug: "breathing-techniques-better-sleep",
        url: "https://www.sleepfoundation.org/sleep-hygiene/yoga-for-sleep",
    },
    {
        id: 5,
        title: "Yoga for Back Pain: Gentle Poses That Help",
        excerpt: "Alleviate back pain with these gentle yoga poses designed to strengthen and stretch your spine.",
        category: "Therapy",
        readTime: "8 min read",
        date: "Nov 15, 2024",
        slug: "yoga-for-back-pain",
        url: "https://www.spine-health.com/wellness/exercise/yoga-back-pain-relief",
    },
    {
        id: 6,
        title: "Building a Consistent Yoga Practice",
        excerpt: "Tips and strategies to maintain a regular yoga practice and make it a sustainable part of your life.",
        category: "Lifestyle",
        readTime: "5 min read",
        date: "Nov 10, 2024",
        slug: "building-consistent-yoga-practice",
        url: "https://www.yogajournal.com/practice/build-home-practice/",
    },
];

export default function BlogPage() {
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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2">Yoga Blog</h1>
                <p className="text-muted-foreground text-lg">Insights, tips, and inspiration for your yoga journey</p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {BLOG_POSTS.map((post) => (
                    <motion.div key={post.id} variants={item}>
                        <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary">{post.category}</Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {post.readTime}
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{post.title}</CardTitle>
                                <CardDescription className="flex items-center text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {post.date}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                                <Link href={post.url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="w-full group">
                                        Read More
                                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Want more yoga tips and wellness insights? Book a class with us and get personalized guidance!
                </p>
                <Link href="/student/book">
                    <Button size="lg" className="shadow-lg">
                        Book a Class
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
