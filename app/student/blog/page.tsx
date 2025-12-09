import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOgImage } from "@/lib/getOgImage";
import FeaturedArticle from "./featured-article";
import BlogCard from "./blog-card";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";

export default async function BlogPage() {
    const featuredArticle = {
        title: "The Science Behind Mindfulness and Stress Reduction",
        description:
            "Discover how daily mindfulness practice can physically reshape your brain and lower stress hormones.",
        category: "Mental Health",
        author: "Dr. Andrew Huberman",
        date: "Oct 12, 2023",
        imageUrl: "/blog-featured.jpg",
        link: "https://www.yogajournal.com/meditation/how-to-meditate/",
    };

    const articles = [
        {
            title: "5 Yoga Poses to Help You Sleep Better",
            description: "Gentle yoga poses that calm your nervous system and improve sleep quality.",
            category: "Wellness",
            date: "Yoga Journal",
            link: "https://www.yogajournal.com/poses/yoga-by-benefit/sleep/",
        },
        {
            title: "Mindfulness Meditation: A Beginner’s Guide",
            description: "What mindfulness meditation is and how to start practicing it daily.",
            category: "Mindfulness",
            date: "Verywell Mind",
            link: "https://www.verywellmind.com/mindfulness-meditation-88369",
        },
        {
            title: "Yoga for Beginners: Simple Tips to Get Started",
            description: "A complete beginner-friendly guide to starting yoga safely.",
            category: "Practice",
            date: "Healthline",
            link: "https://www.healthline.com/health/fitness/yoga-for-beginners",
        },
        {
            title: "The 7 Chakras: Meaning and Energy Explained",
            description: "Understand the chakra system and how it relates to mental and physical well-being.",
            category: "Philosophy",
            date: "Yoga Journal",
            link: "https://www.yogajournal.com/yoga-101/chakras/",
        },
        {
            title: "What to Eat Before and After Yoga",
            description: "Nutrition tips for fueling your yoga practice and recovery.",
            category: "Nutrition",
            date: "Healthline",
            link: "https://www.healthline.com/nutrition/best-pre-yoga-foods",
        },
        {
            title: "Hot Yoga Benefits and Safety Tips",
            description: "Pros, cons, and safety advice before trying hot yoga.",
            category: "Practice",
            date: "Healthline",
            link: "https://www.healthline.com/health/hot-yoga",
        },
    ];

    const articlesWithImages = await Promise.all(
        articles.map(async (article) => ({
            ...article,
            image: (await getOgImage(article.link)) ?? FALLBACK_IMAGE,
        }))
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="bg-slate-950 py-16 text-center">
                <Badge variant="outline" className="mb-4">
                    The Yoga Journal
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    Insights for your <span className="text-primary">Body & Mind</span>
                </h1>

                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                    Explore articles to deepen your yoga and wellness journey.
                </p>

                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                    <Input placeholder="Search articles..." className="pl-10 rounded-full" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <FeaturedArticle article={featuredArticle} />

                <div className="grid md:grid-cols-2 gap-8">
                    {articlesWithImages.map((article, i) => (
                        <BlogCard key={i} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}
