// Versi sederhana dan ringkas dari ManageCourts dengan UI tetap bagus + Edit & Delete
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit3, Trash2 } from "lucide-react";

const initialCourts = [
  {
    id: 1,
    name: "Court Alpha",
    type: "Synthetic",
    status: "Active",
    location: "A - 2",
    capacity: 12,
    bookings: 8,
    revenue: 2400,
  },
  {
    id: 2,
    name: "Court Beta",
    type: "Vinyl",
    status: "Inactive",
    location: "B - 1",
    capacity: 10,
    bookings: 0,
    revenue: 0,
  },
];

const ManageCourts = () => {
  const [courts, setCourts] = useState(initialCourts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "Synthetic",
    location: "",
    capacity: "",
  });

  const filtered = courts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (form.id === null) {
      setCourts([
        ...courts,
        { ...form, id: Date.now(), bookings: 0, revenue: 0, status: "Active" },
      ]);
    } else {
      setCourts(courts.map((c) => (c.id === form.id ? { ...form } : c)));
    }
    resetForm();
  };

  const handleEdit = (court) => {
    setForm(court);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus lapangan ini?")) {
      setCourts(courts.filter((c) => c.id !== id));
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      type: "Synthetic",
      location: "",
      capacity: "",
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Lapangan</h1>
          <p className="text-gray-500 text-sm">
            Pantau dan kelola lapangan olahraga
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </header>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lapangan..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select className="pl-10 pr-4 py-2 border rounded-lg bg-white">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((court) => (
          <div
            key={court.id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <h2 className="font-semibold text-lg">{court.name}</h2>
            <p className="text-sm text-gray-500">
              {court.location} • {court.type}
            </p>
            <div className="text-sm">Kapasitas: {court.capacity}</div>
            <div className="text-sm">Booking: {court.bookings}</div>
            <div className="text-sm mb-2">Pendapatan: Rp{court.revenue}</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(court)}
                className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(court.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {form.id ? "Edit Lapangan" : "Tambah Lapangan"}
            </h3>
            <input
              required
              placeholder="Nama"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              required
              placeholder="Lokasi"
              name="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              required
              placeholder="Kapasitas"
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="Synthetic">Synthetic</option>
              <option value="Vinyl">Vinyl</option>
              <option value="Hardwood">Hardwood</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCourts;
