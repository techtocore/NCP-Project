var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        required: true,
    },
    isFaculty: {
        type: Boolean,
        default: false,
    },
    isSuperuser: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
