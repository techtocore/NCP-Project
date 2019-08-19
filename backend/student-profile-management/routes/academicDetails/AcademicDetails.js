var mongoose = require('mongoose');
var AcademicDetailsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    sslcInstitution: {
        type: String,
        required: true
    },
    sslcBoard: {
        type: String,
        required: true
    },
    sslcYearOfPassing: {
        type: Number,
        required: true
    },
    sslcMarks: {
        type: Number,
        required: true
    },
    hscInstitution: {
        type: String,
        required: true
    },
    hscBoard: {
        type: String,
        required: true
    },
    hscYearOfPassing: {
        type: Number,
        required: true
    },
    hscMarks: {
        type: Number,
        required: true
    },
    ugAdmissionNumber: {
        type: String,
        required: true
    },
    ugAcademicProgram: {
        type: String,
        required: true
    },
    ugYearOfJoining: {
        type: Number,
        required: true
    },
    ugYearofPassing: {
        type: Number,
        required: true
    },
    ugEnrollmentStatus: {
        type: String,
        required: true
    },
    ugSemester: {
        type: Number,
        required: true
    },
    ugSGPA: {
        type: Number,
        required: true
    },
    ugCGPA: {
        type: Number,
        required: true
    }
});
mongoose.model('AcademicDetail', AcademicDetailsSchema);

module.exports = mongoose.model('AcademicDetail');
