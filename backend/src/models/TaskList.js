const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = require('./Task').schema;

// TaskList
const TaskListSchema = new Schema(
    {   description: { type: String },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [TaskSchema],
        active: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TaskList', TaskListSchema);