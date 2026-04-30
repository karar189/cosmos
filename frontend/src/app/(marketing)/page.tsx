import {
  CtaHlsSection,
  MissionSection,
  MonoHero,
  NeuralTestimonial,
  ProcessSection,
  SolutionSection,
  TestimonialsSection,
} from "@/components/marketing/mono";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <MonoHero />
      <NeuralTestimonial />
      <SolutionSection />
      <ProcessSection />
      <MissionSection />
      <TestimonialsSection />
      <CtaHlsSection />
    </div>
  );
};

export default HomePage;
