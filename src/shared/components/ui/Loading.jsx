import { Loader2 } from "lucide-react";

export default function Loading({ text = "Memuat halaman..." }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md bg-gradient-to-br from-ballwhite to-ballgray rounded-xl shadow-xl p-6 overflow-hidden">

        {/* Background bubble */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-10 left-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-ballgreen/5 animate-pulse"></div>
          <div className="absolute top-32 right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 left-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-ballgreen/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-28 right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-ballorange/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Modern Spinner */}
          <div className="relative mb-8 w-24 h-24 mx-auto sm:w-28 sm:h-28">
            <div className="absolute inset-0 border-4 border-ballgray rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-ballgreen to-emerald-600 shadow-lg animate-pulse">
                <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-lg sm:text-xl font-bold text-ballblack animate-pulse">{text}</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm text-gray-500 animate-pulse">Mohon tunggu sebentar...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
