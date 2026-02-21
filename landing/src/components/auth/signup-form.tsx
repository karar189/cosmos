"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const SignUpForm = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-muted-foreground text-sm">
                Authentication is not configured. You can go to the dashboard or home.
            </p>
            <div className="flex gap-2">
                <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                    Back to home
                </Button>
            </div>
        </div>
    );
};

export default SignUpForm;
