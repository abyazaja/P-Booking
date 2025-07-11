import { Loader2 } from "lucide-react";

export default function Loading({ text = "Memuat halaman..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-ballgreen mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
} 