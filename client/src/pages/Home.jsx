import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  pinNote,
} from "../services/api";
import NoteCard from "../components/NoteCard";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaStickyNote } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import bgImage from "../assets/notebanner.jpg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notes fetch
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await getNotes();
      setNotes(data.data);
    } catch (error) {
      setError("Notes fetch failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editNote) {
        await updateNote(editNote._id, noteData);
      } else {
        await createNote(noteData);
      }

      setFormData({ title: "", content: "", tags: "" });
      setShowForm(false);
      setEditNote(null);
      fetchNotes();
    } catch (error) {
      setError("Failed! to save the note");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteNote(id);
        fetchNotes();
      } catch (error) {
        setError("Delete failed!");
      }
    }
  };

  const handlePin = async (id) => {
    try {
      await pinNote(id);
      fetchNotes();
    } catch (error) {
      setError("Pin failed!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  //notes export
  const exportAsTxt = () => {
    if (notes.length === 0) {
      alert("No notes available to export!");
      return;
    }
    const content = notes
      .map(
        (note) =>
          `Title: ${note.title}\n\nContent:\n${note.content}\n\nTags: ${note.tags.join(
            ", ",
          )}\n\n---------------------------------\n`,
      )
      .join("");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
  };

  //Export Pdf

  const exportAsPdf = () => {
    const doc = new jsPDF();
    if (notes.length === 0) {
      alert("No notes available to export!");
      return;
    }
    let y = 10;

    notes.forEach((note, index) => {
      doc.setFontSize(16);
      doc.text(note.title, 10, y);
      y += 10;

      doc.setFontSize(12);

      const contentLines = doc.splitTextToSize(note.content, 180);

      doc.text(contentLines, 10, y);

      y += contentLines.length * 7;

      doc.text(`Tags: ${note.tags.join(", ")}`, 10, y);

      y += 15;

      // Add new page if needed
      if (y > 260 && index < notes.length - 1) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("notes.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
      {/* Navbar */}
      <nav
        className="
    sticky top-0 z-50
    backdrop-blur-lg
    bg-white/80 dark:bg-gray-900/80
    border-b border-gray-200 dark:border-gray-700
    px-8 py-4
    flex items-center justify-between
    shadow-sm
  "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="
        w-11 h-11
        rounded-xl
        bg-gradient-to-r
        from-blue-500
        to-purple-600
        flex items-center justify-center
        shadow-lg
      "
          >
            <FaStickyNote className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notes App
            </h1>
            <p className="text-xs text-gray-500">Organize your ideas</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* User */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="
          w-10 h-10 rounded-full
          bg-gradient-to-r
          from-indigo-500
          to-purple-600
          text-white
          flex items-center justify-center
          font-bold
        "
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-gray-500">Welcome back</p>

              <p className="font-semibold text-gray-800 dark:text-white">
                {user?.name}
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
        w-11 h-11
        rounded-full
        flex items-center justify-center
        bg-gray-100
        dark:bg-gray-800
        hover:scale-110
        transition-all
      "
          >
            {theme === "dark" ? (
              <FaSun className="text-yellow-400 text-lg" />
            ) : (
              <FaMoon className="text-gray-700 text-lg" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
        bg-gradient-to-r
        from-red-500
        to-rose-600
        text-white
        px-5 py-2.5
        rounded-xl
        font-medium
        shadow-md
        hover:shadow-xl
        hover:scale-105
        transition-all
      "
          >
            Logout
          </button>
        </div>
      </nav>

      <div
        className="max-w-6xl mx-auto p-6"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Add Note Button 
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        My Notes
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditNote(null);
                            setFormData({ 
                                title: '', 
                                content: '', 
                                tags: '' 
                            });
                        }}
                        className="bg-blue-500 text-white px-4 py-2 
                            rounded-lg hover:bg-blue-600"
                    >
                        + Add Note
                    </button>
                </div>*/}
        <div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
    rounded-2xl shadow-lg p-5 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                My Notes
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage, search and export your notes
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2
        -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
            w-72
            pl-10 pr-4 py-3
            rounded-xl
            border border-gray-300
            dark:border-gray-600
            dark:bg-gray-700
            dark:text-white
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            transition-all
        "
                />
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditNote(null);
                  setFormData({
                    title: "",
                    content: "",
                    tags: "",
                  });
                }}
                className="
        flex items-center gap-2
        bg-gradient-to-r
        from-blue-500
        to-indigo-600
        text-white
        px-5 py-3
        rounded-xl
        font-medium
        shadow-md
        hover:shadow-xl
        hover:scale-105
        transition-all
    "
              >
                <FaPlus />
                Add Note
              </button>

              <button
                onClick={exportAsTxt}
                className="
        flex items-center gap-2
        bg-emerald-500
        text-white
        px-5 py-3
        rounded-xl
        font-medium
        shadow-md
        hover:bg-emerald-600
        hover:shadow-xl
        hover:scale-105
        transition-all
    "
              >
                📄 TXT
              </button>

              <button
                onClick={exportAsPdf}
                className="
        flex items-center gap-2
        bg-rose-500
        text-white
        px-5 py-3
        rounded-xl
        font-medium
        shadow-md
        hover:bg-rose-600
        hover:shadow-xl
        hover:scale-105
        transition-all
    "
              >
                PDF
              </button>
            </div>
          </div>
        </div>
        {/* Error */}
        {error && (
          <div
            className="bg-red-100 text-red-600 
                        p-3 rounded mb-4"
          >
            {error}
          </div>
        )}

        {/* Note Form */}
        {showForm && (
          <div
            className="bg-white p-6 rounded-lg 
                        shadow-md mb-6"
          >
            <h3 className="text-lg font-bold mb-4">
              {editNote ? "Edit Note" : "New Note"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 
                                    rounded-lg mb-3 focus:outline-none 
                                    focus:border-blue-500"
                required
              />
              <textarea
                placeholder="Content..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 
                                    rounded-lg mb-3 focus:outline-none 
                                    focus:border-blue-500 h-32"
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated: react, node)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 
                                    rounded-lg mb-4 focus:outline-none 
                                    focus:border-blue-500"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-500 text-white 
                                        px-6 py-2 rounded-lg 
                                        hover:bg-blue-600"
                >
                  {editNote ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditNote(null);
                  }}
                  className="bg-gray-400 text-white 
                                        px-6 py-2 rounded-lg 
                                        hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-10 text-gray-500 flex items-center justify-center gap-2">
            Notes are not exist — Add Note!
            <FaStickyNote className="text-yellow-500 text-xl" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-3 gap-4"
          >
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPin={handlePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
