import { AnimationContainer, HeroWithUnicorn, MaxWidthWrapper } from "@/components";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { PROCESS } from "@/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
    return (
        <div id="about" className="overflow-x-hidden scrollbar-hide size-full bg-[#050a12] -mt-40 min-h-screen relative">
            {/* First section: full-viewport Unicorn embed + hero overlay (frontend-inspired) */}
            <HeroWithUnicorn />
            {/* Hero blue gradient - extends into dashboard area for smooth transition */}
            <div
                className="absolute inset-x-0 top-0 h-[210vh] min-h-[48rem] pointer-events-none z-0 "
                style={{
                    background: [
                        'radial-gradient(ellipse 140% 100% at 50% -10%, rgba(59, 130, 246, 0.18) 0%, rgba(30, 58, 138, 0.12) 35%, rgba(15, 23, 42, 0.06) 55%, transparent 75%)',
                        'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(5, 10, 18, 0.3) 75%, rgba(5, 10, 18, 0.7) 90%, #050a12 100%)',
                    ].join(', '),
                }}
                aria-hidden
            />
            {/* CTA Section - right after hero */}
            <MaxWidthWrapper className="relative z-10 mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="bg-gradient-to-b from-blue-100 to-cyan-200 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                                Onboarding and payments, unified
                            </h2>
                            <p className="text-blue-100/80 mt-6 max-w-md mx-auto">
                                Your users get clarity. You get faster conversions. Payments become automatic. Operations become seamless.
                            </p>
                            <div className="mt-6">
                                <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-blue-500/25">
                                    <Link href="/auth/sign-up" className="flex items-center">
                                        Get started for free
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>
            {/* Features Section */}
            <MaxWidthWrapper className="relative z-10 pt-6 pb-4 md:pt-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col w-full items-center lg:items-center justify-center py-6 md:py-8">
                        <MagicBadge title="Features" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            One workflow link. Onboarding, payments, and tracking.
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Hypertron gives you a unified way to run client onboarding and payments through one powerful workflow link.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <BentoGrid className="py-6 md:py-8">
                        {CARDS.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} />
                        ))}
                    </BentoGrid>
                </AnimationContainer>
            </MaxWidthWrapper>

            {/* Dashboard preview section */}
            <MaxWidthWrapper className="relative z-10 mt-0">
                <div className="flex flex-col items-center justify-center w-full text-center">
                    <AnimationContainer delay={0.2} className="relative pt-12 pb-20 md:py-32 px-2 bg-transparent w-full">
                        <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow opacity-70"></div>
                        <div className="-m-2 rounded-xl p-2 lg:-m-4 lg:rounded-2xl bg-blue-950/30 backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.25),0_0_0_1px_rgba(59,130,246,0.08),inset_0_0_60px_-20px_rgba(0,0,0,0.4)]">
                            <BorderBeam
                                size={250}
                                duration={12}
                                delay={9}
                            />
                            <Image
                                src="/assets/dashboard-dark.svg"
                                alt="Dashboard"
                                width={1200}
                                height={1200}
                                quality={100}
                                className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                            />
                            <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-[#050a12] z-40"></div>
                            <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-[#050a12] z-50"></div>
                        </div>
                    </AnimationContainer>
                </div>
            </MaxWidthWrapper >

            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="The Process" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            From signup to payment in 3 steps
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Create your workflow, share the link with clients or borrowers, and get paid securely.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
                    {PROCESS.map((process, id) => (
                        <AnimationContainer delay={0.2 * id} key={id}>
                            <MagicCard className="group md:py-8 border border-blue-500/20 bg-blue-950/30 hover:border-blue-500/40 hover:bg-blue-950/50">
                                <div className="flex flex-col items-start justify-center w-full">
                                    <process.icon strokeWidth={1.5} className="w-10 h-10 text-blue-400" />
                                    <div className="flex flex-col relative items-start">
                                        <span className="absolute -top-6 right-0 border-2 border-blue-500/50 text-blue-100 font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5 bg-blue-950/80">
                                            {id + 1}
                                        </span>
                                        <h3 className="text-base mt-6 font-medium text-foreground">
                                            {process.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {process.description}
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>

        </div>
    )
};

export default HomePage
