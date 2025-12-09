/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Unsplash fallback
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },

            // Yoga Journal (sometimes uses subdomains)
            {
                protocol: "https",
                hostname: "**.yogajournal.com",
            },

            // Healthline (THIS FIXES YOUR ERROR)
            {
                protocol: "https",
                hostname: "assets.healthline.com",
            },
            {
                protocol: "https",
                hostname: "**.healthline.com",
            },

            // Verywell Mind
            {
                protocol: "https",
                hostname: "**.verywellmind.com",
            },
        ],
    },
};

export default nextConfig;
