const express = require('express');
const {
    getAllNotes,
    createNewNote,
    getNotebyId,
    updateNote,
    removeNote,
} = require('../controllers/noteController');

const router = express.Router();

router.route('/').get(getAllNotes).post(createNewNote);

router
    .route('/:id')
    .get(getNotebyId)
    .patch(updateNote)
    .delete(removeNote);

module.exports = router;
