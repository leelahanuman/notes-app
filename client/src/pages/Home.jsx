import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotes, createNote, updateNote, 
         deleteNote, pinNote } from '../services/api';
import NoteCard from '../components/NoteCard';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaStickyNote } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import bgImage from "../assets/notebanner.jpg";


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Notes fetch 
    useEffect(() => {
        if (!user) {
            navigate('/login');
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
            setError('Notes fetch failed!');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const noteData = {
                ...formData,
                tags: formData.tags.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag)
            };

            if (editNote) {
                await updateNote(editNote._id, noteData);
            } else {
                await createNote(noteData);
            }

            setFormData({ title: '', content: '', tags: '' });
            setShowForm(false);
            setEditNote(null);
            fetchNotes();
        } catch (error) {
            setError('Failed! to save the note');
        }
    };

    const handleEdit = (note) => {
        setEditNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags.join(', ')
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await deleteNote(id);
                fetchNotes();
            } catch (error) {
                setError('Delete failed!');
            }
        }
    };

    const handlePin = async (id) => {
        try {
            await pinNote(id);
            fetchNotes();
        } catch (error) {
            setError('Pin failed!');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
   );


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 
                flex justify-between items-center">
                <h1 className="text-xl flex items-center justify-center gap-2 font-bold text-blue-600 dark:bg-gray-900">
                    <FaStickyNote className="text-yellow-500 text-xl" /> Notes App
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600  dark:text-gray-300 text-sm">
                        Hi, {user?.name}!
                    </span>
                    <button
                        onClick={toggleTheme}
                        className="text-xl px-2 py-1 rounded-lg
                            hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <FaSun className="text-yellow-400 text-xl"/>
                        ) : (
                            <FaMoon className="text-gray-700 text-xl" />
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 
                            rounded-lg hover:bg-red-600 text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6" style={{ backgroundImage: `url(${bgImage})` }}>
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:bg-gray-900">
        My Notes
    </h2>

    <div className="flex gap-3 relative w-full md:w-auto">
        <FaSearch className="absolute right-37 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
            type="text"
            placeholder="Search notes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-lg
                focus:outline-none focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

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
            className="bg-blue-500  flex items-center justify-center gap-2 text-white px-4 py-2
                rounded-lg hover:bg-blue-600"
        >
            <FaPlus />Add Note
        </button>
    </div>
</div>
                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-600 
                        p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Note Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg 
                        shadow-md mb-6">
                        <h3 className="text-lg font-bold mb-4">
                            {editNote ? 'Edit Note' : 'New Note'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    title: e.target.value
                                })}
                                className="w-full border px-3 py-2 
                                    rounded-lg mb-3 focus:outline-none 
                                    focus:border-blue-500"
                                required
                            />
                            <textarea
                                placeholder="Content..."
                                value={formData.content}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    content: e.target.value
                                })}
                                className="w-full border px-3 py-2 
                                    rounded-lg mb-3 focus:outline-none 
                                    focus:border-blue-500 h-32"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tags (comma separated: react, node)"
                                value={formData.tags}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    tags: e.target.value
                                })}
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
                                    {editNote ? 'Update' : 'Save'}
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
                    <div className="text-center py-10 text-gray-500">
                        Loading...
                    </div>
                ) : filteredNotes.length === 0 ? (
                   <div className="text-center py-10 text-gray-500 flex items-center justify-center gap-2">
                        Notes are not exist — Add Note!
                        <FaStickyNote className="text-yellow-500 text-xl" />
                    </div>
                    
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-3 gap-4">
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