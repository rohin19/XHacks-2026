"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { geocodeAddress, findNeighborhood } from '@/app/lib/geocoding';
import type { GeocodeResult } from '@/app/lib/geocoding';
import { useRouter } from 'next/navigation';

interface AddressSearchProps {
    onLocationSelect?: (location: [number, number], neighborhood?: string) => void;
}

export default function AddressSearch({ onLocationSelect }: AddressSearchProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout>();
    const router = useRouter();

    // Debounced search
    const handleInputChange = useCallback((value: string) => {
        setQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Set new timeout for debounced search
        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await geocodeAddress(value);
                setSuggestions(results.features || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Geocoding error:', error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    }, []);

    const handleSelectSuggestion = useCallback((result: GeocodeResult) => {
        const location: [number, number] = result.center;
        setQuery(result.place_name);
        setShowSuggestions(false);
        setSelectedLocation(location);

        // Find neighborhood
        const neighborhood = findNeighborhood(location);
        if (neighborhood) {
            setSelectedNeighborhood(neighborhood.properties.name);
            if (onLocationSelect) {
                onLocationSelect(location, neighborhood.properties.slug);
            }
        } else {
            setSelectedNeighborhood(null);
            if (onLocationSelect) {
                onLocationSelect(location);
            }
        }
    }, [onLocationSelect]);

    const handleNavigateToDashboard = useCallback(() => {
        if (selectedLocation) {
            const neighborhood = findNeighborhood(selectedLocation);
            if (neighborhood) {
                router.push(`/neighborhood/${neighborhood.properties.slug}`);
            }
        }
    }, [selectedLocation, router]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowSuggestions(false);
        if (showSuggestions) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showSuggestions]);

    return (
        <div className="max-w-2xl w-full relative">
            {/* Search Bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (suggestions.length > 0) {
                        handleSelectSuggestion(suggestions[0]);
                    }
                }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="relative flex items-center group"
                    style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(40px)",
                        WebkitBackdropFilter: "blur(40px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "100px",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow:
                            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)";
                        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.3)";
                        e.currentTarget.style.boxShadow =
                            "0 12px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.boxShadow =
                            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                    }}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="enter your address"
                        className="flex-1 bg-transparent outline-none px-8 py-5 text-base"
                        style={{
                            color: "#ffffff",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            letterSpacing: "-0.01em",
                        }}
                    />
                    <button
                        type="submit"
                        className="m-2 p-4 rounded-full transition-all"
                        style={{
                            background: "rgba(150, 150, 150, 0.7)",
                            color: "white",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(120, 120, 120, 0.9)";
                            e.currentTarget.style.boxShadow = "0 6px 28px rgba(0, 0, 0, 0.3)";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(150, 150, 150, 0.7)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        )}
                    </button>
                </div>

                {/* Autocomplete Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div
                        className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden"
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                            >
                                <MapPin size={18} className="text-blue-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {suggestion.text}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {suggestion.place_name}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </form>

            {/* Neighborhood Detection Result */}
            {selectedNeighborhood && selectedLocation && (
                <div
                    className="mt-4 p-4 rounded-2xl flex items-center justify-between animate-fadeIn"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Navigation size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">
                                You're in {selectedNeighborhood}
                            </p>
                            <p className="text-xs text-white/70">
                                Click to view community dashboard
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNavigateToDashboard}
                        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white text-sm font-medium"
                    >
                        View Dashboard →
                    </button>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
