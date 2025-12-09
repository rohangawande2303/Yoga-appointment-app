"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";

type BlogCardProps = {
    article: {
        title: string;
        description: string;
        category: string;
        date: string;
        link: string;
        image: string;
    };
};

export default function BlogCard({ article }: BlogCardProps) {
    const [src, setSrc] = useState(article.image);

    return (
        <Link href={article.link} target="_blank" className="group">
            <Card className="bg-transparent border-none">
                <div className="relative h-60 rounded-2xl overflow-hidden mb-4">
                    <Image
                        src={src}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onError={() => setSrc(FALLBACK_IMAGE)}
                    />
                    <Badge className="absolute top-4 left-4 bg-black/50 text-white">
                        {article.category}
                    </Badge>
                </div>

                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground mb-1">
                        {article.date}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-2">
                        {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {article.description}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
