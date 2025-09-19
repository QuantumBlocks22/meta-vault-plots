import Header from "@/components/Header";
import LandGrid from "@/components/LandGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background circuit pattern */}
      <div className="fixed inset-0 circuit-bg opacity-5 pointer-events-none"></div>
      
      <Header />
      
      <main className="flex-1 relative">
        <LandGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
