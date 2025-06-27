import { BsDatabaseExclamation } from "react-icons/bs";

export default function EmptyState({ text = "Belum ada data" }) {
    return (
        <div className="py-12 text-center">
            <div className="mx-auto flex justify-center text-gray-400 mb-4">
                <BsDatabaseExclamation className="text-5xl" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
                {text}
            </p>
            <p className="text-gray-400 text-sm mt-2">
                Message belum ada
            </p>
        </div>
    )
}