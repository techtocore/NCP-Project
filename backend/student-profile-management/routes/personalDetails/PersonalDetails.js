var mongoose = require('mongoose');
var PersonalDetailsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        require: true
    },
    gender: {
        type: Boolean,
        require: true
    },
    hosteller: {
        type: Boolean,
        require: true
    },
    religion: {
        type: String,
        require: true
    },
    caste: {
        type: String,
        require: true
    },
    gaurdianName: {
        type: String,
        require: true
    },
    gaurdianContactNumeber: {
        type: String,
        required: true
    }

});
mongoose.model('PersonalDetail', PersonalDetailsSchema);

module.exports = mongoose.model('PersonalDetail');
