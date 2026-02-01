"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AddressSearch from "@/app/components/search/AddressSearch";

// Dynamically import map to avoid SSR issues
const LandingMap = dynamic(() => import("@/app/components/maps/LandingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <p className="text-white text-sm">Loading map...</p>
    </div>
  ),
});

export default function LandingPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sky Background */}
      <div className="absolute inset-0">
        <img
          src="/background-sky.png"
          alt="Sky background"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-900/30" />
      </div>

      {/* Main Content - Open Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Centered Logo */}
        <header className="p-8 md:p-12">
          <div className="flex flex-col items-center gap-3">
            {/* NN Logo */}
            <div style={{ width: "40px", height: "40px" }}>
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="2"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "38px",
                    fontWeight: 500,
                    fill: "rgba(255, 255, 255, 0.9)",
                    letterSpacing: "-2px",
                  }}
                >
                  nn
                </text>
              </svg>
            </div>
            {/* Brand text - micro typography */}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.8)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              neighborhood news
            </span>
          </div>
        </header>

        {/* Center Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="w-full flex flex-col items-center">
            {/* Main Headline - Mouthwash Style - Centered */}
            <h1
              className="mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                fontWeight: 300,
                color: "#ffffff",
                letterSpacing: "-0.04em",
                lineHeight: "1.0",
                textAlign: "center",
                paddingBottom: 50,
              }}
            >
              Your community,
              <br />
              your news.
            </h1>

            {/* Address Search Bar with Geocoding */}
            <AddressSearch onLocationSelect={(location) => setUserLocation(location)} />

            {/* Tagline - Centered Below Search */}
            <p
              className="mt-6 text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: "0.02em",
                lineHeight: "1.4",
                maxWidth: "600px",
              }}
            >
              The most recent local news that affects your
              community.
            </p>

            {/* Meta Information - Centered and Larger with Enhanced Letter Spacing */}
            <div className="mt-10 flex gap-12 justify-center flex-wrap">
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                01 — hyperlocal
              </span>
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                02 — real-time
              </span>
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                03 — relevant
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Map */}
        <div className="px-8 pb-8">
          <div
            className="w-full backdrop-blur-md"
            style={{
              height: "60vh",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow:
                "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <LandingMap userLocation={userLocation} />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 3rem !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
    </div>
  );
}
