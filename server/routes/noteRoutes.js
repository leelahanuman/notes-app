const express = require('express');
const router = express.Router();

const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  pinNote,
  getArchivedNotes,
  restoreNote,
  permanentlyDeleteNote
} = require('../controllers/noteController');

const { protect } = require('../middleware/auth');

router.get('/', protect, getNotes);
router.get('/archive', protect, getArchivedNotes);
router.post('/', protect, createNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.put('/:id/pin', protect, pinNote);
router.put('/:id/restore', protect, restoreNote);
router.delete('/:id/permanent', protect, permanentlyDeleteNote);

module.exports = router;