import { Loader2 } from "lucide-react";

export default function Loading({ text = "Memuat halaman..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ballwhite to-ballgray">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-ballorange/3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Modern Loading Animation */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className="w-20 h-20 mx-auto border-4 border-ballgray rounded-full animate-spin"></div>
          
          {/* Inner Spinning Ball */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ballgreen to-emerald-600 shadow-lg animate-pulse">
              <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
              </div>
            </div>
          </div>
          
          {/* Secondary Spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        </div>

        {/* Loading Text with Typing Effect */}
        <div className="space-y-2">
          <p className="text-xl font-bold text-ballblack animate-pulse">
            {text}
          </p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Subtle Hint */}
          <p className="text-sm text-gray-500 mt-4 animate-pulse">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
} 