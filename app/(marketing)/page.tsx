import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ExamRibbon from "@/components/landing/ExamRibbon";
import HowItWorks from "@/components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen bg-aurora-gradient">
      <Sidebar />
      <main className="flex-1">
        <Hero />
        <ExamRibbon />
        <HowItWorks />
        <Footer />
      </main>
    </div>
  );
}
