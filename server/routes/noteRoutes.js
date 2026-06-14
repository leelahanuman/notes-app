const express = require('express');
const router = express.Router();
const { 
    getNotes, 
    createNote, 
    updateNote, 
    deleteNote,
    pinNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

// All routes protected — middleware use chestundi
router.get('/', protect, getNotes);
router.post('/', protect, createNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.put('/:id/pin', protect, pinNote);

module.exports = router;