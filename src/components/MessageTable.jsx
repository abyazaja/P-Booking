import React from "react";
import { AiFillDelete } from "react-icons/ai";
import GenericTable from "./GenericTable";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

const MessageTable = ({ 
  messages = [], 
  loading = false, 
  error = "", 
  handleDelete = () => {} 
}) => {
  if (loading) return <LoadingSpinner text="Memuat pesan..." />;
  if (error) return <EmptyState text="Gagal memuat pesan" />;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold">Daftar Pesan ({messages.length})</h3>
      </div>

      {messages.length === 0 ? (
        <EmptyState text="Belum ada pesan" />
      ) : (
        <GenericTable
          columns={["#", "Nama", "Email", "Pesan", "Aksi"]}
          data={messages}
          renderRow={(message, index) => (
            <>
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4 font-semibold">{message.name}</td>
              <td className="px-6 py-4">{message.email}</td>
              <td className="px-6 py-4">{message.message}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleDelete(message.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiFillDelete size={20} />
                </button>
              </td>
            </>
          )}
        />
      )}
    </div>
  );
};

export default MessageTable;