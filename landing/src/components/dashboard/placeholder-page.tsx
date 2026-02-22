"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card className="rounded-xl border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <CardDescription>This feature is not built yet. Check back later.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            You can use the main Dashboard for payment links, receive address, withdraw, and ZK pool.
          </p>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
