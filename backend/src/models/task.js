const mongoose = require('mongoose');
const { Schema } = mongoose;
const TodoSchema = require('./todo');

const TaskSchema = new Schema({
    description: { type: String },
    members: { type: Array },
    //todos: [TodoSchema],
    published: { type: Date },
    updated: { type: Date },
    active: { type: Boolean },
});

module.exports = mongoose.model('Task', TaskSchema);