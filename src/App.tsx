import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import SmartContract from "./components/SmartContract";

function App() {
  return (
    <div className="bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-800 bg-black/50 h-full w-full text-slate-300">
      <Navbar />
      <HeroSection />
      <FAQ />
      <SmartContract />
      <Footer />
    </div>
  );
}

export default App;
