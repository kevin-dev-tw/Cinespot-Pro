import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { FloatingPillNav } from './components/FloatingPillNav';
import { HeroSection } from './components/HeroSection';
import { MarqueeTicker } from './components/MarqueeTicker';
import { AsymmetricalGrid } from './components/AsymmetricalGrid';
import { AgendaTimeline } from './components/AgendaTimeline';
import { SpeakerProfiles } from './components/SpeakerProfiles';
import { SpeakerModal } from './components/SpeakerModal';
import { VenueExperience } from './components/VenueExperience';
import { FooterSection } from './components/FooterSection';
import { TicketModal } from './components/TicketModal';
import { CustomCursor } from './components/CustomCursor';
import { SPEAKERS } from './data/eventData';
import type { Speaker } from './types';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [navPosition, setNavPosition] = useState<'top' | 'bottom'>('top');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [selectedTierForModal, setSelectedTierForModal] = useState<string>('tier-pro');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Locomotive-inspired inertia smooth scroll via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Section Observer for active navigation pill highlight
  useEffect(() => {
    const sectionIds = ['hero', 'concept', 'agenda', 'speakers', 'experience', 'tickets'];

    const handleScrollSpy = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = rect.top + scrollY;
          if (scrollY >= top - windowHeight * 0.35) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -20 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenTickets = (tierId = 'tier-pro') => {
    setSelectedTierForModal(tierId);
    setIsTicketModalOpen(true);
  };

  const handleSelectSpeakerById = (speakerId: string) => {
    const found = SPEAKERS.find((s) => s.id === speakerId);
    if (found) {
      setSelectedSpeaker(found);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#edeef2] overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Custom Fluid Cursor */}
      <CustomCursor />

      {/* Floating Pill Navigation Bar (Fixed Top or Bottom) */}
      <FloatingPillNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenTickets={() => handleOpenTickets('tier-pro')}
        navPosition={navPosition}
        setNavPosition={setNavPosition}
      />

      {/* Main Landing Page Content */}
      <main>
        {/* 01 // Hero Section */}
        <HeroSection
          onOpenTickets={() => handleOpenTickets('tier-pro')}
          onExploreAgenda={() => handleNavigate('agenda')}
        />

        {/* Fluid Locomotive Marquee Ticker 1 */}
        <MarqueeTicker
          items={[
            'FLUID INERTIA DYNAMICS',
            'MONUMENTAL SCULPTURAL TYPE',
            'WEBGPU SHADERS',
            'LOCOMOTIVE SCROLL ARCHITECTURE',
            'TOKYO ARCH PAVILION',
            'OCTOBER 28—30, 2026',
          ]}
        />

        {/* 02 // Asymmetrical Grid Sections (Concept / About / Highlights) */}
        <AsymmetricalGrid />

        {/* Fluid Locomotive Marquee Ticker 2 (Reverse) */}
        <MarqueeTicker
          reverse
          className="border-t border-b border-white/10 bg-[#06070a]"
          items={[
            'SYNTHESIS GUILD',
            'ROPPONGI TECH DISTRICT',
            '35.6628° N, 139.7314° E',
            'BINAURAL SPATIAL LAB',
            '3,500+ GLOBAL ATTENDEES',
            'EXPERIMENTAL WEB ARTIFACTS',
          ]}
        />

        {/* 03 // Event Agenda Timeline */}
        <AgendaTimeline onSelectSpeaker={handleSelectSpeakerById} />

        {/* 04 // Speaker Profiles Grid */}
        <SpeakerProfiles onSelectSpeaker={handleSelectSpeakerById} />

        {/* 05 // Venue & Spatial Experience */}
        <VenueExperience />

        {/* 06 // Sticky Contact & Ticket Booking Footer */}
        <FooterSection
          onOpenTicketsWithTier={(tierId) => handleOpenTickets(tierId)}
          onOpenTickets={() => handleOpenTickets('tier-pro')}
        />
      </main>

      {/* Interactive Speaker Profile Modal */}
      <SpeakerModal
        speaker={selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
      />

      {/* Ticket Booking / Reservation Modal with Confetti */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        initialTierId={selectedTierForModal}
      />
    </div>
  );
}

export default App;
