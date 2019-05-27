const mongoose = require('mongoose');
const { Schema } = mongoose;

// User
const UserSchema = new Schema(
    {   name: { type: String },
        email: { type: String },
        token: { type: String },
        expire: { type: Date, default: Date.now() + 3600000 },
        active: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);