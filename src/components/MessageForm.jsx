import React from "react";
import AlertBox from "./AlertBox";

const MessageForm = ({ 
  dataForm = { name: "", email: "", message: "" },
  handleChange = () => {},
  handleSubmit = () => {},
  loading = false,
  error = "",
  success = ""
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tambah Pesan Baru
      </h3>

      {error && <AlertBox type="error">{error}</AlertBox>}
      {success && <AlertBox type="success">{success}</AlertBox>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={dataForm.name}
          onChange={handleChange}
          placeholder="Nama Pengirim"
          disabled={loading}
          required
          className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        
        {/* Field email dan message sama struktur dengan di atas */}
        
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Tambah Pesan"}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;