import React, { useState, useRef } from "react";
import { editProjectImage } from "../services/geminiService";

const VisualAgent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await editProjectImage(selectedImage, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-7xl mx-auto">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="bg-teal-500/10 p-2 rounded-lg text-teal-400">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </span>
            Site Imagery Analysis
          </h2>
          <p className="text-slate-400">
            Visualize infrastructure interventions and analyze site risks using
            generative computer vision.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Model
          </div>
          <div className="text-sm text-teal-400 font-mono">TaC 0.1 Image</div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Input Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col relative group">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Original Site Footage
            </h3>

            <div
              className={`flex-1 rounded-xl border-2 border-dashed transition-all duration-300 relative overflow-hidden ${
                !selectedImage
                  ? "border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-teal-500/50 cursor-pointer"
                  : "border-slate-800 bg-black"
              }`}
              onClick={() => !selectedImage && fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Source"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setGeneratedImage(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg font-medium text-sm flex items-center gap-2"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      Remove Image
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-8 w-8 text-slate-500 group-hover:text-teal-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-slate-300 font-medium text-lg">
                    Upload Site Photo
                  </p>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs text-center">
                    Drag and drop or click to upload JPEG/PNG for visual
                    analysis.
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/png, image/jpeg"
              />
            </div>
          </div>

          <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Generative Intervention
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the modification (e.g., 'Add solar panels to the roof')"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none"
                disabled={!selectedImage || isProcessing}
              />
              <button
                onClick={handleEdit}
                disabled={!selectedImage || !prompt.trim() || isProcessing}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20 whitespace-nowrap"
              >
                {isProcessing ? "Processing..." : "Visualize"}
              </button>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest">
              Analysis Output
            </h3>
            {isProcessing && (
              <span className="text-xs text-teal-500 animate-pulse font-mono">
                GENERATING_ASSETS...
              </span>
            )}
          </div>

          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative min-h-[300px]">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 text-slate-600 max-w-sm">
                {error ? (
                  <div className="text-red-400">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 border-2 border-dashed border-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl opacity-20">✨</span>
                    </div>
                    <p className="text-slate-500">
                      Modified visualization will appear here.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-6 flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-500">
                <p>Generated by TaC Engine</p>
              </div>
              <a
                href={generatedImage}
                download="tac-visual-impact.png"
                className="text-sm text-white hover:text-teal-400 font-medium flex items-center gap-2 transition-colors"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Download Asset
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualAgent;
