export default function GenericTable({ columns, data, renderRow }) { 
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto overflow-hidden rounded-2xl shadow-lg border border-gray-200">
                <thead className="bg-hijau text-white text-sm font-semibold">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-left whitespace-nowrap">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-gray-800 text-sm divide-y divide-gray-100">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
