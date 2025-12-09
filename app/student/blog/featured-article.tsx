"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";

type FeaturedArticleProps = {
    article: {
        title: string;
        description: string;
        category: string;
        author: string;
        date: string;
        imageUrl: string;
        link: string;
    };
};

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
    const [src, setSrc] = useState(article.imageUrl);

    return (
        <div className="mb-16 grid md:grid-cols-2 gap-6 bg-card rounded-3xl overflow-hidden">
            <div className="relative h-64 md:h-auto">
                <Image
                    src={src}
                    alt={article.title}
                    fill
                    className="object-cover"
                    onError={() => setSrc(FALLBACK_IMAGE)}
                />
                <Badge className="absolute top-4 left-4">
                    {article.category}
                </Badge>
            </div>

            <div className="p-8">
                <p className="text-xs text-muted-foreground mb-2">
                    {article.date} • {article.author}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                    {article.title}
                </h2>

                <p className="text-muted-foreground mb-6">
                    {article.description}
                </p>

                <Button asChild>
                    <a href={article.link} target="_blank">
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
