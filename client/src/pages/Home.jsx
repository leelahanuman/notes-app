import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotes, createNote, updateNote, 
         deleteNote, pinNote } from '../services/api';
import NoteCard from '../components/NoteCard';

const Home = () => {
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

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md px-6 py-4 
                flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">
                    📝 Notes App
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">
                        Hi, {user?.name}!
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 
                            rounded-lg hover:bg-red-600 text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                {/* Add Note Button */}
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
                ) : notes.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        Notes levu — Add Note click cheyyi! 📝
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-3 gap-4">
                        {notes.map((note) => (
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