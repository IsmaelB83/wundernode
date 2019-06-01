const mongoose = require('mongoose');
const { Schema } = mongoose;

// TaskList
const TaskListSchema = new Schema(
    {   
        description: { type: String },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        starred: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        active: { type: Boolean, default: true },
        icon: { type: String },
        color: { type: String },
        system: { type: Boolean, default: false },
        systemId: { type: Number },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TaskList', TaskListSchema);