import { messagesAPI } from "../../shared/services/messageAPI";
import { useState, useEffect } from "react";
import AlertBox from "../../shared/components/ui/AlertBox";


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
    <div className="mt-16 mb-24 w-full max-w-5xl mx-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Have questions or want to book by phone? We'd love to hear from you! 
            Reach out and let's start the conversation.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="group bg-gradient-to-br from-ballgreen/20 to-emerald-100 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-xl font-bold text-ballgreen mb-4">Phone</h3>
            <p className="text-ballblack text-lg font-semibold">+62 812-3456-7890</p>
            <p className="text-sm text-gray-600 mt-2">Available 24/7 for bookings</p>
          </div>

          <div className="group bg-gradient-to-br from-ballorange/20 to-orange-100 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-xl font-bold text-ballorange mb-4">Email</h3>
            <p className="text-ballblack text-lg font-semibold">info@planetfutsal.com</p>
            <p className="text-sm text-gray-600 mt-2">We'll respond within 24 hours</p>
          </div>
        </div>

        {/* Alert Messages */}
        {error && <AlertBox type="error" dismissible>{error}</AlertBox>}
        {success && <AlertBox type="success" dismissible>{success}</AlertBox>}

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-ballblack mb-6 text-center">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <input
                  type="text"
                  name="name"
                  value={dataForm.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  disabled={loading}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-ballgreen focus:ring-4 focus:ring-ballgreen/20 transition-all duration-300 group-hover:border-gray-300"
                />
              </div>

              <div className="group">
                <input
                  type="email"
                  name="email"
                  value={dataForm.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  disabled={loading}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-ballgreen focus:ring-4 focus:ring-ballgreen/20 transition-all duration-300 group-hover:border-gray-300"
                />
              </div>

              <div className="group">
                <textarea
                  name="message"
                  value={dataForm.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  disabled={loading}
                  required
                  rows={6}
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-ballgreen focus:ring-4 focus:ring-ballgreen/20 transition-all duration-300 group-hover:border-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-ballgreen to-emerald-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <span>✉️</span>
                      Send Message
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-ballgreen transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-ballgreen/10 via-emerald-50 to-ballorange/10 rounded-2xl">
            <p className="text-lg font-semibold text-ballblack">
              🏟️ Visit Our Facility
            </p>
            <p className="text-gray-700 text-sm max-w-md">
              Jl. Sport Center No. 123, Cityville<br/>
              Open daily from 8:00 AM to 11:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}