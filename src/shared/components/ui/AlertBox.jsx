import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useState } from "react";

export default function AlertBox({ type = "info", children, dismissible = false, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);
    
    const baseClass = "relative px-6 py-4 rounded-2xl mb-6 shadow-lg border text-sm font-medium transition-all duration-300 animate-in slide-in-from-top-2"

    const styles = {
        success: "bg-gradient-to-r from-ballgreen/10 to-green-50 border-ballgreen/30 text-ballgreen shadow-ballgreen/20",
        error: "bg-gradient-to-r from-red-50 to-red-100/50 border-red-300 text-red-700 shadow-red-200/50",
        info: "bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-300 text-blue-700 shadow-blue-200/50",
        warning: "bg-gradient-to-r from-ballorange/10 to-orange-50 border-ballorange/30 text-ballorange shadow-ballorange/20",
    }

    const icons = {
        success: <CheckCircle className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <Info className="h-5 w-5" />,
    }

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    if (!isVisible) return null;

    return (
        <div className={`${baseClass} ${styles[type] || styles.info}`}>
            {/* Animated Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50"></div>
            
            <div className="relative flex items-start">
                <div className="flex-shrink-0">
                    <div className="p-1 rounded-full bg-white/50 backdrop-blur-sm">
                        {icons[type] || icons.info}
                    </div>
                </div>
                <div className="ml-3 flex-1">
                    {children}
                </div>
                
                {dismissible && (
                    <button 
                        onClick={handleDismiss}
                        className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/30 transition-colors duration-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            
            {/* Subtle Animation Line */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse opacity-30"></div>
        </div>
    )
}