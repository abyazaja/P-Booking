const courts = [
  { id: 1, name: 'Court 1', type: 'Synthetic', status: 'Active', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Court 2', type: 'Vinyl', status: 'Active', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80' },
];

const Courts = () => (
    <div className="w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack text-center">Our Courts</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {courts.map(court => (
          <div key={court.id} className="bg-ballgray/30 rounded-2xl shadow-lg p-4 flex flex-col items-center">
            <img src={court.img} alt={court.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 className="text-xl font-bold text-ballblack mb-2">{court.name}</h2>
            <p className="text-ballgreen font-semibold mb-1">Type: {court.type}</p>
            <p className={`font-semibold mb-2 ${court.status === 'Active' ? 'text-ballgreen' : 'text-ballorange'}`}>Status: {court.status}</p>
          </div>
        ))}
      </div>
    </div>
);

export default Courts; 