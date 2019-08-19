var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('../auth/VerifyToken');
var VerifySuperUser = require('../auth/VerifySuperUser');

var OtherDetail = require('./OtherDetails');
var config = require('../../config');

router.use(bodyParser.urlencoded({ extended: true }));

async function addDetails(data) {
    try {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const A = await OtherDetail.findOneAndUpdate({ username: data.username }, data, options);
        return { message: 'Updated Successfuly' };
    }
    catch (error) {
        throw error;
    }
}

router.post('/:username?', VerifyToken, function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    if (req.body.papersAndProjectStatus.toLowerCase().includes("published"))
        req.body.papersAndProjectStatus = true;
    else
        req.body.papersAndProjectStatus = false;

    const username = req.params.username || req.username;

    const data = {
        username: username,
        competitiveExamsAppeared: req.body.competitiveExamsAppeared,
        clubs: req.body.clubs,
        eventsOrganised: req.body.eventsOrganised,
        eventsAttended: req.body.eventsAttended,
        workshopsOrganised: req.body.workshopsOrganised,
        workshopsAttended: req.body.workshopsAttended,
        eventsAndWorkshop: req.body.eventsAndWorkshop,
        papersAndProject: req.body.papersAndProject,
        papersAndProjectStatus: req.body.papersAndProjectStatus,
        fieldsOfSpecialization: req.body.fieldsOfSpecialization,
        computerLanguagesKnown: req.body.computerLanguagesKnown,
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
        const data = await OtherDetail.findOne({ username: username }, { _id: 0, __v: 0 })

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
        const data = await OtherDetail.find({}, { _id: 0, __v: 0 })

        if (!data)
            return res.status(404).send({ message: "Not Found" })

        return res.status(200).send({ data: data })
    }
    catch (error) {
        return res.status(500).send({ message: error.toString() })
    }

})


module.exports = router;