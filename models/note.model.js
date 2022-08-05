const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must have a title'],
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Must have max group Content'],
        maxLength: 1000
    },
    status: {
        type: String,
        enum: ['Incomplete', 'Completed', 'Time out'],
        required: [true, 'Must have status'],
    },
    startDate: {
      type: Date,
      default: Date.now(),

    },
    endDate: {
      type: Date,
      required: [true, 'Must have end day'],
    },
    CreatedAt: {
      type: Date,
      default: Date.now(),
      select: false, // mean when query by select whill hide this field
    },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
