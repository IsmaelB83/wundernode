const mongoose = require('mongoose');
const { Schema } = mongoose;

// Task
const TaskSchema = new Schema(
    {  
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        taskList: { type: Schema.Types.ObjectId, ref: 'TaskList' },
        description: { type: String },
        due: { type: Date },
        reminder: { type: Date },
        starred: { type: Boolean, default: false },
        completed: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }    
);

module.exports = mongoose.model('Task', TaskSchema);