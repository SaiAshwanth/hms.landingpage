import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileNavigation } from '../components/layout/MobileNavigation';
import { CommandPalette } from '../components/layout/CommandPalette';
import { AppointmentModal } from '../features/appointments/components/AppointmentModal';
import { AIDoctorBot } from '../components/layout/AIDoctorBot';
import { ScrollProgressBar } from '../components/motion/ScrollProgressBar';
import { MarqueeTicker } from '../components/motion/MarqueeTicker';

import { HeroSection } from '../features/home/sections/Hero';
import { HospitalOverviewSection } from '../features/home/sections/HospitalOverview';
import { SpecialityExplorerSection } from '../features/departments/pages/SpecialityExplorer';
import { CareRoomsSection } from '../features/home/sections/CareRoomsSection';
import { DoctorsPreviewSection } from '../features/doctors/pages/DoctorsPreview';
import { PatientStoriesSection } from '../features/stories/pages/PatientStoriesSection';
import { DayAtAureliaSection } from '../features/home/sections/DayAtAureliaSection';
import { FacilitiesSection } from '../features/facilities/pages/FacilitiesSection';
import { EmergencySection } from '../features/emergency/pages/EmergencySection';
import { CampusSection } from '../features/campus/pages/CampusSection';
import { VisitReimaginedSection } from '../features/home/sections/VisitReimaginedSection';
import { AppointmentSection } from '../features/appointments/pages/AppointmentSection';

export function App() {
  return (
    <PageContainer>
      {/* Global Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Global Header & Overlays */}
      <Header />
      <MobileNavigation />
      <CommandPalette />
      <AppointmentModal />

      {/* Bottom-Right AI Doctor Bot Floating Popup */}
      <AIDoctorBot />

      {/* Main Living Hospital Storyline */}
      <main>
        <HeroSection />
        <MarqueeTicker speed={30} />
        <HospitalOverviewSection />
        <SpecialityExplorerSection />
        <CareRoomsSection />
        <DoctorsPreviewSection />
        <PatientStoriesSection />
        <DayAtAureliaSection />
        <FacilitiesSection />
        <EmergencySection />
        <CampusSection />
        <MarqueeTicker direction="right" speed={35} />
        <VisitReimaginedSection />
        <AppointmentSection />
      </main>

      {/* Footer */}
      <Footer />
    </PageContainer>
  );
}

export default App;
