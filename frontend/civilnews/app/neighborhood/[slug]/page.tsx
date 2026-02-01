"use client";

import { CommunityHeader } from "@/app/components/CommunityHeader";
import { FilterBar } from "@/app/components/FilterBar";
import { CommunityFeed } from "@/app/components/CommunityFeed";
import { Sidebar } from "@/app/components/Sidebar";
import { DarkModeToggle } from "@/app/components/DarkModeToggle";
import { NeighborhoodMap } from "@/app/components/maps/NeighborhoodMap";
import { useState, useEffect, useMemo } from "react";
import { Map, Menu } from "lucide-react";
import { useNeighborhoodEvents, useEvents } from '@/app/hooks/useEvents';
import { NEIGHBORHOODS } from "@/app/lib/neighborhoods";

type Props = {
    params: Promise<{ slug: string }>;
};

export default function NeighborhoodDashboard({ params }: Props) {
    const [selectedCategory, setSelectedCategory] =
        useState<string>("all");
    const [selectedTimeframe, setSelectedTimeframe] =
        useState<string>("week");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] =
        useState<boolean>(false);
    const [slug, setSlug] = useState<string>("");

    // Unwrap the params promise
    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    // Find the neighborhood by slug
    const neighborhood = useMemo(() => {
        if (!slug) return null;
        return NEIGHBORHOODS.features.find(
            (feature) => feature.properties.slug === slug
        );
    }, [slug]);

    // Get the neighborhood ID for API calls
    const neighborhoodId = neighborhood?.properties?.id?.toString();

    // Fetch events for this neighborhood using Supabase UUID
    const { events, loading, error } = useNeighborhoodEvents(neighborhoodId);

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
                className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar isDarkMode={isDarkMode} />
            </div>

            {/* Hamburger Menu (all screen sizes) */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 lg:top-6 left-4 lg:left-6 z-30 p-2 rounded-lg bg-white border-2 border-[#E1E8ED] shadow-lg hover:bg-[#F8FAFC] transition-all"
            >
                <Menu size={20} className="stroke-[#1E3A8A]" />
            </button>

            {/* Top Right Button Group */}
            <div
                className={`fixed top-4 lg:top-6 right-4 lg:right-6 z-30 flex items-center gap-2 lg:gap-3 transition-all ${showMap ? "lg:mr-[500px]" : ""}`}
            >
                <DarkModeToggle
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />

                <button
                    onClick={() => setShowMap(!showMap)}
                    className={`px-3 lg:px-4 py-2 rounded-lg border-2 shadow-lg font-['Inter',sans-serif] text-xs lg:text-sm font-medium transition-all flex items-center gap-2 ${showMap
                        ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                        : "bg-white border-[#E1E8ED] text-[#1E3A8A] hover:bg-[#F8FAFC]"
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
                    className={`flex-1 px-4 lg:px-12 py-4 lg:py-8 overflow-y-auto transition-all ${showMap ? "lg:mr-[500px]" : ""}`}
                >
                    <CommunityHeader
                        isDarkMode={isDarkMode}
                        neighborhoodName={neighborhood?.properties?.name || 'Neighborhood'}
                    />
                    <FilterBar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedTimeframe={selectedTimeframe}
                        setSelectedTimeframe={setSelectedTimeframe}
                        isDarkMode={isDarkMode}
                        events={events} // Pass events for metrics
                    />
                    <CommunityFeed
                        events={events}
                        loading={loading}
                        error={error}
                        selectedCategory={selectedCategory}
                        selectedTimeframe={selectedTimeframe}
                        onSelectPost={handleSelectPost}
                        selectedPostIds={selectedPosts.map((p) => p.id)}
                    />
                </main>

                {/* Neighborhood Map Panel */}
                {showMap && slug && (
                    <NeighborhoodMap
                        neighborhoodSlug={slug}
                        selectedPosts={selectedPosts}
                        onRemove={handleRemoveFromMap}
                        onClose={() => setShowMap(false)}
                    />
                )}
            </div>
        </div>
    );
}
