import React from 'react';
import { Footer, Navbar } from "@/components";

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="relative min-h-screen">
            <div id="home" className="absolute inset-0 z-0 bg-[#050a12] min-h-full" aria-hidden />
            <header className="relative z-[99999]">
                <Navbar />
            </header>
            <main className="relative z-10 mt-14 mx-auto w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MarketingLayout
