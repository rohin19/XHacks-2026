import { useState } from "react";
import { Search } from "lucide-react";
import backgroundSky from "figma:asset/e7f54fcaced8a688fe086b10ebead4b2e6ee9683.png";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sky Background */}
      <div className="absolute inset-0">
        <img
          src={backgroundSky}
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

            {/* Subheadline - Removed (was duplicate) */}

            {/* Glass Search Bar */}
            <form
              onSubmit={handleSearch}
              className="max-w-2xl w-full"
            >
              <div
                className="relative flex items-center group"
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "100px",
                  transition:
                    "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.18)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
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
                    e.currentTarget.style.background =
                      "rgba(120, 120, 120, 0.9)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 28px rgba(0, 0, 0, 0.3)";
                    e.currentTarget.style.transform =
                      "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(150, 150, 150, 0.7)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.transform =
                      "scale(1)";
                  }}
                >
                  <Search
                    className="w-5 h-5"
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </form>

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

        {/* Bottom Globe Placeholder */}
        <div className="px-8 pb-8">
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: "35vh",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              border: "1px dashed rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow:
                "0 4px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "10px",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              globe component placeholder
            </p>
          </div>
        </div>
      </div>

      {/* Google Fonts Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Custom Styles */}
      <style>{`
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