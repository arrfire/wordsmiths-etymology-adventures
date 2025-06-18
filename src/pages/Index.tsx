// src/pages/Index.tsx - UPDATED
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Features from '@/components/Features';
import FeaturesHighlight from '@/components/FeaturesHighlight'; // NEW
import Community from '@/components/Community';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Hero />
      <Stats />
      <FeaturesHighlight /> {/* NEW: Highlighted features section */}
      <Features />
      <Community />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;