export default function LoadingSpinner({ text = "Memuat..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
                {/* Spinning element */}
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="text-gray-600 font-medium">{text}</div>
        </div>
    )
}