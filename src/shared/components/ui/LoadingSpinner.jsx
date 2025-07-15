export default function LoadingSpinner({ 
  text = "Memuat...", 
  size = "md", 
  fullScreen = false,
  overlay = false 
}) {
  // Size variations
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-ballgray`}></div>
        
        {/* Inner Spinning Ball */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-ballgreen to-emerald-600 shadow-lg animate-pulse`} style={{ transform: 'scale(0.8)' }}>
            <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
            </div>
          </div>
        </div>
        
        {/* Spinning Border */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-ballgreen border-t-transparent animate-spin`}></div>
      </div>

      {text && (
        <div className="text-center space-y-2">
          <p className={`text-ballblack font-semibold ${textSizes[size]} animate-pulse`}>
            {text}
          </p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-ballwhite to-ballgray flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-ballorange/3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="relative z-10 px-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  // Overlay loading
  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <LoadingContent />
        </div>
      </div>
    );
  }

  // Inline loading (responsive container)
  return (
    <div className="w-full min-h-[200px] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <LoadingContent />
    </div>
  );
}