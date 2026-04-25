import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="flex flex-col gap-6 border-t border-border/30 px-8 py-12 sm:flex-row sm:items-center sm:justify-between md:px-28">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hypertron. All rights reserved.
      </p>
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <Link href="/privacy" className="transition-colors hover:text-foreground">
          Privacy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-foreground">
          Terms
        </Link>
        <Link href="mailto:kararsweta@gmail.com" className="transition-colors hover:text-foreground">
          Email
        </Link>
        <Link href="https://calendly.com/kararsweta/30min" className="transition-colors hover:text-foreground">
          Book a demo
        </Link>
      </div>
    </footer>
  );
}
