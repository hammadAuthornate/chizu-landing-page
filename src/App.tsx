import Navbar from "./components/Navbar";
import SmartContract from "./components/SmartContract";

function App() {
  return (
    <div className="bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-800 bg-black/50 h-screen w-screen text-slate-300">
      <Navbar />
      <SmartContract />
    </div>
  );
}

export default App;
