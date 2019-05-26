const mongoose = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
    id: { type: String },
    description: { type: String },
    due: { type: Date },
    reminder: { type: Date },
    starred: { type: Boolean },
    completed: { type: Boolean },
});

module.exports = mongoose.model('Todo', TodoSchema);