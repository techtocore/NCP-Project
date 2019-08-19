var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('../auth/VerifyToken');
var VerifySuperUser = require('../auth/VerifySuperUser');

var AcademicDetail = require('./AcademicDetails');
var config = require('../../config');

router.use(bodyParser.urlencoded({ extended: true }));

async function addDetails(data) {
    try {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const A = await AcademicDetail.findOneAndUpdate({}, data, options);
        return { message: 'Updated Successfuly' };
    }
    catch (error) {
        throw error;
    }
}

router.post('/:username?', VerifyToken, function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    const data = {
        username: username,
        sslcInstitution: req.body.sslcInstitution,
        sslcBoard: req.body.sslcBoard,
        sslcYearOfPassing: parseInt(req.body.sslcYearOfPassing),
        sslcMarks: parseFloat(req.body.sslcMarks),
        hscInstitution: req.body.hscInstitution,
        hscBoard: req.body.hscBoard,
        hscYearOfPassing: parseInt(req.body.hscYearOfPassing),
        hscMarks: parseFloat(req.body.hscMarks),
        ugAdmissionNumber: req.body.ugAdmissionNumber,
        ugAcademicProgram: req.body.ugAcademicProgram,
        ugYearOfJoining: parseInt(req.body.ugYearOfJoining),
        ugYearofPassing: parseInt(req.body.ugYearofPassing),
        ugEnrollmentStatus: req.body.ugEnrollmentStatus,
        ugSemester: parseInt(req.body.ugSemester),
        ugSGPA: parseFloat(req.body.ugSGPA),
        ugCGPA: parseFloat(req.body.ugCGPA),
    }

    addDetails(data).then((msg) => {
        res.status(200).send(msg);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });

});

router.get('/:username?', VerifyToken, async function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    try {
        const data = await AcademicDetail.findOne({ username: username }, { _id: 0, __v: 0 })

        if (!data)
            return res.status(404).send({ message: "Not Found" })

        return res.status(200).send({ data: data })
    }
    catch (error) {
        return res.status(500).send({ message: error.toString() })
    }
});

router.get('/data/all', VerifyToken, async function (req, res) {
    if (!(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    try {
        const data = await AcademicDetail.find({}, { _id: 0, __v: 0 })

        if (!data)
            return res.status(404).send({ message: "Not Found" })

        return res.status(200).send({ data: data })
    }
    catch (error) {
        return res.status(500).send({ message: error.toString() })
    }

})


module.exports = router;