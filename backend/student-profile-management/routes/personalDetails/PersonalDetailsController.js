var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('../auth/VerifyToken');
var VerifySuperUser = require('../auth/VerifySuperUser');

var PersonalDetail = require('./PersonalDetails');
var config = require('../../config');

router.use(bodyParser.urlencoded({ extended: true }));

async function addDetails(data) {
    try {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const A = await PersonalDetail.findOneAndUpdate({ username: data.username }, data, options);
        return { message: 'Updated Successfuly' };
    }
    catch (error) {
        throw error;
    }
}

router.post('/:username?', VerifyToken, function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    if (req.body.gender.toLowerCase().includes("male"))
        req.body.gender = true;
    else
        req.body.gender = false;
    if (req.body.hosteller.toLowerCase().includes("hosteller"))
        req.body.hosteller = true;
    else
        req.body.hosteller = false;

    const username = req.params.username || req.username;

    const data = {
        username: username,
        address: req.body.address,
        gender: req.body.gender,
        hosteller: req.body.hosteller,
        religion: req.body.religion,
        caste: req.body.caste,
        gaurdianName: req.body.gaurdianName,
        gaurdianContactNumeber: req.body.gaurdianContactNumeber,
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
        const data = await PersonalDetail.findOne({ username: username }, { _id: 0, __v: 0 })

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
        const data = await PersonalDetail.find({}, { _id: 0, __v: 0 })

        if (!data)
            return res.status(404).send({ message: "Not Found" })

        return res.status(200).send({ data: data })
    }
    catch (error) {
        return res.status(500).send({ message: error.toString() })
    }

})


module.exports = router;