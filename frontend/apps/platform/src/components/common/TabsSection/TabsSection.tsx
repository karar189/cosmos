import { useScrollToSection } from '@/hooks';
import { Tab, Tabs } from '@core3/ui-components';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';

interface TabsSectionProps {
  data: {
    label: string;
    value: string;
  }[];
}

export type TabsSectionRef = {
  scrollToSection: (sectionId: string) => void;
  scrollToCurrentSection: () => void;
};

const TabsSection = forwardRef<TabsSectionRef, TabsSectionProps>((props, ref) => {
  const { data } = props;
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Desktop: use scroll observer, Mobile: disable it
  const { scrollToSection, hash, scrollToCurrentSection } = useScrollToSection({
    offset: 260,
    sectionIds: data.map((item) => item.value),
    handleObserveScroll: !isMobile, // Disable scroll observer on mobile
  });
  
  useImperativeHandle(ref, () => ({
    scrollToSection,
    scrollToCurrentSection,
  }));
  
  const handleTabChange = (_: unknown, newValue: string) => {
    if (isMobile) {
      // Mobile: Update URL hash and scroll to top
      window.history.replaceState(null, '', `#${newValue}`);
      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Force a hash change event for the useScrollToSection hook to pick up
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      // Desktop: Scroll to section (existing behavior)
      scrollToSection(newValue);
    }
  };
  
  // Provide a fallback value to prevent MUI Tabs from receiving null
  const effectiveValue = hash || data[0]?.value || 'overview';
  
  return (
    <Tabs value={effectiveValue} onChange={handleTabChange}>
      {data.map((item, index) => (
        <Tab key={`${item.value}-${index}`} label={item.label} value={item.value} />
      ))}
    </Tabs>
  );
});

TabsSection.displayName = 'TabsSection';

export default TabsSection;
