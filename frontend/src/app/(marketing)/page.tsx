import {
  ChangedSection,
  CtaHlsSection,
  MissionSection,
  MonoHero,
  NeuralTestimonial,
  SolutionSection,
} from "@/components/marketing/mono";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <MonoHero />
      <NeuralTestimonial />
      <SolutionSection />
      <ChangedSection />
      <MissionSection />
      <CtaHlsSection />
    </div>
  );
};

export default HomePage;
