"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-destructive/20 p-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        You don't have permission to access the admin panel.
                        Only authorized administrators can access this area.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Link href="/student">
                            <Button className="w-full">Go to Student Dashboard</Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button variant="outline" className="w-full">Back to Login</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
