import Link from "next/link";
import { Flower } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="py-12 border-t border-white/5 bg-background text-foreground">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center space-x-2 text-primary mb-4">
                            <Flower className="h-6 w-6" />
                            <span className="font-bold text-xl text-white">Zenith Yoga</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Finding peace, one breath at a time. Join us on the mat.
                        </p>
                    </div>

                    <div className="flex gap-16">
                        <div>
                            <h4 className="font-bold mb-4 text-sm tracking-wider uppercase text-white/50">Studio</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/student/schedule" className="hover:text-primary transition-colors">Timetable</Link></li>
                                <li><Link href="/student/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link href="/student/locations" className="hover:text-primary transition-colors">Locations</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm tracking-wider uppercase text-white/50">Social</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-white/5 text-xs text-muted-foreground">
                    <p>© 2024 Zenith Yoga. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
