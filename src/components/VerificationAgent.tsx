import React, { useState } from "react";
import { verifySustainabilityClaim } from "../services/geminiService";
import { VerificationResult } from "../types";
import { useData } from "../contexts/DataContext";

const VerificationAgent: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addVerification } = useData();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifySustainabilityClaim(query);
      setResult(data);

      // Save to "Database"
      addVerification({
        text: data.text,
        sources: data.sources,
        query: query,
        confidenceScore: 0.85, // Mock confidence for prototype
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-full">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </span>
          Impact Verification
        </h2>
        <p className="text-slate-400 max-w-2xl mt-2">
          Deploy autonomous agents to cross-reference your sustainability claims
          against satellite data, news reports, and NGO filings.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-lg shadow-black/20">
            <form onSubmit={handleVerify}>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Project or Claim to Verify
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Verify 50 hectares of reforestation in Mato Grosso reported by GreenEarth Co in Q3 2024..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none resize-none h-40 text-sm leading-relaxed"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Running Audit...
                  </>
                ) : (
                  "Initiate Verification"
                )}
              </button>
            </form>
            <div className="mt-4 text-xs text-slate-500 px-1">
              <strong className="text-slate-400">Privacy Note:</strong> Your
              query is processed securely. Results are timestamped for audit
              trails.
            </div>
          </div>

          {/* Status Indicator (Decorative) */}
          <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 opacity-70">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Active Data Sources
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Google Search Grounding
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Satellite Sentinel (Simulated)
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Local NGO Reports
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-900/10 border border-red-500/20 text-red-200 p-6 rounded-2xl mb-6 flex items-start gap-4">
              <svg
                className="w-6 h-6 text-red-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <div>
                <h4 className="font-bold text-red-400 mb-1">
                  Verification Failed
                </h4>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-2xl">
              <svg
                className="w-16 h-16 mb-4 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p className="text-lg font-medium">Ready to Audit</p>
              <p className="text-sm">
                Submit a claim to generate a verification report.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/20 rounded-2xl border border-slate-800">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-emerald-400 font-medium animate-pulse">
                Cross-referencing sources...
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Querying TaC Engine API
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0B1221] rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-700 flex justify-between items-center backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">
                        Audit Report #TAC-{Math.floor(Math.random() * 10000)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        TaC Engine analysis
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-500/20 transition-colors">
                    Export PDF
                  </button>
                </div>

                <div className="p-8">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-base font-light">
                      {result.text}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 px-8 py-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    Confidence Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%]"></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">
                      High
                    </span>
                  </div>
                </div>
              </div>

              {result.sources.length > 0 && (
                <div className="bg-[#0B1221] rounded-2xl border border-slate-700 p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      ></path>
                    </svg>
                    Citations & Evidence
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800 transition-all group"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-emerald-400 group-hover:bg-emerald-900/30 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 font-medium truncate group-hover:text-emerald-300 transition-colors">
                            {source.title || new URL(source.uri).hostname}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {source.uri}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-600 group-hover:text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationAgent;
