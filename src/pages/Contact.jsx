import { messagesAPI } from "../services/messageAPI";
import { useState, useEffect } from "react";
import AlertBox from "../components/AlertBox";


export default function contact() {
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
    <div className="mt-9 mb-20 w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 text-center">
      {/* Form Section */}
      <div >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack text-center">
          Contact Us
        </h1>
        <div className="mb-8 text-center">
          <p className="text-ballblack/80">
            Have questions or want to book by phone? Reach out to us!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-4">
            <div className="flex-1 bg-ballgreen/10 rounded-xl p-4">
              <p className="font-semibold text-ballgreen">Phone</p>
              <p className="text-ballblack">‪+62 812-3456-7890‬</p>
            </div>
            <div className="flex-1 bg-ballorange/10 rounded-xl p-4">
              <p className="font-semibold text-ballorange">Email</p>
              <p className="text-ballblack">info@planetfutsal.com</p>
            </div>
          </div>
        </div>

        {error && <AlertBox type="error">{error}</AlertBox>}
        {success && <AlertBox type="success">{success}</AlertBox>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={dataForm.name}
            onChange={handleChange}
            placeholder="Nama Anda"
            disabled={loading}
            required
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          />

          <input
            type="email"
            name="email"
            value={dataForm.email}
            onChange={handleChange}
            placeholder="Email Anda"
            disabled={loading}
            required
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          />

          <textarea
            name="message"
            value={dataForm.message}
            onChange={handleChange}
            placeholder="Isi Pesan Anda"
            disabled={loading}
            required
            rows={4}
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-ballgreen text-white py-3 rounded-xl font-semibold hover:bg-ballgreen/90 transition disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </div>
    </div>
  );
}