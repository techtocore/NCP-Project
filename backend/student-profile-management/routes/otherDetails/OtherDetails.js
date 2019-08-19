var mongoose = require('mongoose');
var OtherDetailsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    competitiveExamsAppeared: {
        type: String,
        required: true
    },
    clubs: {
        type: String,
        required: true
    },
    eventsOrganised: {
        type: String,
        required: true
    },
    eventsAttended: {
        type: String,
        required: true
    },
    workshopsOrganised: {
        type: String,
        required: true
    },
    workshopsAttended: {
        type: String,
        required: true
    },
    eventsAndWorkshopDescription: {
        type: String,
        required: true
    },
    papersAndProject: {
        type: String,
        required: true
    },
    papersAndProjectStatus: {
        type: Boolean,
        required: true
    },
    fieldsOfSpecialization: {
        type: String,
        required: true
    },
    computerLanguagesKnown: {
        type: String,
        required: true
    },
});
mongoose.model('OtherDetail', OtherDetailsSchema);

module.exports = mongoose.model('OtherDetail');
