import { AiFillDelete } from "react-icons/ai";
import { messagesAPI } from "../services/messageAPI";
import { useState, useEffect } from "react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MessagePage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await messagesAPI.createMessage(dataForm);
      setSuccess("Pesan berhasil ditambahkan!");

      setDataForm({ name: "", email: "", message: "" });

      setTimeout(() => setSuccess(""), 3000);
      loadMessages();
    } catch (err) {
      setError(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = (id) => {
    setMessageToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    if (messageToDelete === null) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await messagesAPI.deleteMessage(messageToDelete);
      setSuccess("Pesan berhasil dihapus!");

      loadMessages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setMessageToDelete(null);
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await messagesAPI.fetchMessages();
      setMessages(data);
    } catch (err) {
      setError("Gagal memuat pesan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accept":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "decline":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="mt-11 mb-20 w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 text-center">
      

      {/* Table Section */}
      <div >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Daftar Pesan</h2>
          <span className="text-gray-500">{messages.length} pesan</span>
        </div>

        {loading && <LoadingSpinner text="Memuat pesan..." />}

        {!loading && messages.length === 0 && !error && (
          <EmptyState text="Belum ada pesan. Tambah pesan pertama!" />
        )}

        {!loading && messages.length === 0 && error && (
          <EmptyState text="Terjadi Kesalahan. Coba lagi nanti." />
        )}

        {!loading && messages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengirim
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pesan
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {message.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md whitespace-normal">
                      {message.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(message.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <AiFillDelete className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-700 mb-6">Yakin ingin menghapus pesan ini?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}