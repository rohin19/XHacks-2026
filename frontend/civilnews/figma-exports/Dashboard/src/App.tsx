import { CommunityHeader } from "./components/CommunityHeader";
import { FilterBar } from "./components/FilterBar";
import { CommunityFeed } from "./components/CommunityFeed";
import { Sidebar } from "./components/Sidebar";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { MapPanel } from "./components/MapPanel";
import { useState } from "react";
import { Map, Menu } from "lucide-react";

export default function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<string>("week");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] =
    useState<boolean>(false);

  const handleSelectPost = (post: any) => {
    setSelectedPosts((prev) => {
      const exists = prev.find((p) => p.id === post.id);
      if (exists) {
        // Remove if already selected
        return prev.filter((p) => p.id !== post.id);
      } else {
        // Add to selection and show map
        setShowMap(true);
        return [...prev, post];
      }
    });
  };

  const handleRemoveFromMap = (id: number) => {
    setSelectedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className={`fixed inset-0 z-0 ${isDarkMode ? "bg-[#0F172A]" : "bg-[#F5F7FA]"}`}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isDarkMode={isDarkMode} />
      </div>

      {/* Hamburger Menu (all screen sizes) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 lg:top-6 left-4 lg:left-6 z-30 p-2 rounded-lg bg-white border-2 border-[#E1E8ED] shadow-lg hover:bg-[#F8FAFC] transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Top Right Button Group */}
      <div
        className={`fixed top-4 lg:top-6 right-4 lg:right-6 z-30 flex items-center gap-2 lg:gap-3 transition-all ${showMap ? "lg:mr-[400px]" : ""}`}
      >
        <DarkModeToggle
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <button
          onClick={() => setShowMap(!showMap)}
          className={`px-3 lg:px-4 py-2 rounded-lg border-2 shadow-lg font-['Inter',sans-serif] text-xs lg:text-sm font-medium transition-all flex items-center gap-2 ${
            showMap
              ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
              : "bg-white border-[#E1E8ED] hover:bg-[#F8FAFC]"
          }`}
        >
          <Map size={16} />
          <span className="hidden sm:inline">
            {showMap ? "Hide Map" : "Show Map"}
          </span>
          {selectedPosts.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {selectedPosts.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        <main
          className={`flex-1 px-4 lg:px-12 py-4 lg:py-8 overflow-y-auto transition-all ${showMap ? "lg:mr-[400px]" : ""}`}
        >
          <CommunityHeader isDarkMode={isDarkMode} />
          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            isDarkMode={isDarkMode}
          />
          <CommunityFeed
            selectedCategory={selectedCategory}
            selectedTimeframe={selectedTimeframe}
            onSelectPost={handleSelectPost}
            selectedPostIds={selectedPosts.map((p) => p.id)}
          />
        </main>

        {/* Map Panel */}
        {showMap && (
          <MapPanel
            selectedPosts={selectedPosts}
            onRemove={handleRemoveFromMap}
            onClose={() => setShowMap(false)}
          />
        )}
      </div>
    </div>
  );
}