const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id })
            .sort({ isPinned: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;

        // Fields check 
        if (!title || !content) {
            return res.status(400).json({ 
                message: 'Title and content required' 
            });
        }

        // Note create 
        const note = await Note.create({
            title,
            content,
            tags: tags || [],
            isPinned: isPinned || false,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            data: note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        // Note exists ?
        if (!note) {
            return res.status(404).json({ 
                message: 'Note not found' 
            });
        }

        //  note ? check 
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ 
                message: 'Not authorized' 
            });
        }

        // Update 
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedNote
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        // Note exists ?
        if (!note) {
            return res.status(404).json({ 
                message: 'Note not found' 
            });
        }

        // note ? check 
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ 
                message: 'Not authorized' 
            });
        }

        await Note.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pin/Unpin note
// @route   PUT /api/notes/:id/pin
// @access  Private
const pinNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ 
                message: 'Note not found' 
            });
        }

        // Toggle pin
        note.isPinned = !note.isPinned;
        await note.save();

        res.status(200).json({
            success: true,
            data: note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getNotes, 
    createNote, 
    updateNote, 
    deleteNote,
    pinNote
};