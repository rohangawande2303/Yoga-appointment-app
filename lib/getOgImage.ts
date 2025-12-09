export async function getOgImage(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, { cache: "force-cache" });
        const html = await res.text();

        const match = html.match(
            /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/
        );

        return match ? match[1] : null;
    } catch {
        return null;
    }
}
