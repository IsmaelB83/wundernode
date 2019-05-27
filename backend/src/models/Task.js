const mongoose = require('mongoose');
const { Schema } = mongoose;

// Task
const TaskSchema = new Schema(
    {  
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        due: { type: Date },
        reminder: { type: Date },
        starred: { type: Boolean },
        completed: { type: Boolean },
    },
    {
        timestamps: true,
    }    
);

module.exports = mongoose.model('Task', TaskSchema);