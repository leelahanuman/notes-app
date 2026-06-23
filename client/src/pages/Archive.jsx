import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArchivedNotes, restoreNote, permanentlyDeleteNote } from "../services/api";
import { FaTrash, FaUndo, FaArchive, FaArrowLeft, FaRedo } from "react-icons/fa";

const Archive = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArchived();
  }, []);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const { data } = await getArchivedNotes();
      setNotes(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Restore this note?")) {
      await restoreNote(id);
      fetchArchived();
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Permanently delete this note? This cannot be undone!")) {
      await permanentlyDeleteNote(id);
      fetchArchived(); //  delete 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar style header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between shadow-sm">
        
        {/* Left - Back + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
              <FaArchive className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
                Archived Notes
              </h2>
              <p className="text-xs text-gray-500">Restore or permanently delete</p>
            </div>
          </div>
        </div>

        {/* Right - Refresh button */}
        <button
          onClick={fetchArchived}
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:scale-105 transition-all"
        >
          <FaRedo /> Refresh
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-3">
            <FaArchive className="text-5xl text-orange-300" />
            <p className="text-lg">No archived notes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-orange-400"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-4">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="bg-orange-50 text-orange-600 border border-orange-200 text-xs px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-400 text-xs mb-4">
                  {new Date(note.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleRestore(note._id)}
                    title="Restore Note"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition-all font-medium text-sm"
                  >
                    <FaUndo /> Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(note._id)}
                    title="Delete Forever"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all font-medium text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;