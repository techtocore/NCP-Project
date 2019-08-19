var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');
var bcrypt = require('bcryptjs');
var config = require('../../config');

var AcademicDetail = require('../academicDetails/AcademicDetails')
var PersonalDetail = require('../personalDetails/PersonalDetails')
var OtherDeatil = require('../otherDetails/OtherDetails')

// CREATES A NEW USER
router.post('/', function (req, res) {
    if (req.superuser == 'true' || req.admin == 'true') {
        var hashedPassword = bcrypt.hashSync(req.body.password, 12);
        User.create({
            name: req.body.name,
            password: hashedPassword,
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
        },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
            });

    }
    else {
        res.status(403).send({ auth: false, message: 'Not Allowed' });
    }

});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    if (req.superuser == 'true' || req.admin == 'true') {
        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(users);
        });
    }
    else {
        res.status(403).send({ auth: false, message: 'Not Allowed' });
    }

});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/me/:username?', VerifyToken, async function (req, res) {

    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    try {
        const A = await AcademicDetail.findOne({ username: username }, { _id: 0, __v: 0 });
        const B = await PersonalDetail.findOne({ username: username }, { _id: 0, __v: 0 });
        const C = await OtherDeatil.findOne({ username: username }, { _id: 0, __v: 0 });
        const D = await User.findOne({ username: username }, { password: 0, _id: 0, __v: 0 })


        return res.status(200).send({ user: D, academicDetail: A, personalDetail: B, otherDeatil: C });

    }
    catch (error) {
        return res.status(500).send({ message: error.toString() });
    }
});

router.get('/data/all', VerifyToken, async function (req, res) {

    if (!(req.superuser == 'true' || req.admin == 'true' || req.faculty == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });


    try {
        const Q = [{
            $match: {

            }
        }, {
            $lookup: {
                from: 'academicdetails',
                localField: 'username',
                foreignField: 'username',
                as: 'academicDetail'
            }
        }, {
            $unwind: {
                path: '$academicDetail',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'personaldetails',
                localField: 'username',
                foreignField: 'username',
                as: 'personalDetail'
            }
        }, {
            $unwind: {
                path: '$personalDetail',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'otherdetails',
                localField: 'username',
                foreignField: 'username',
                as: 'otherDetail'
            }
        }, {
            $unwind: {
                path: '$otherDetail',
                preserveNullAndEmptyArrays: true
            }
        }];

        const A = await User.aggregate(Q);


        return res.status(200).send({ data: A });

    }
    catch (error) {
        return res.status(500).send({ message: error.toString() });
    }
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    if (req.superuser == 'true' || req.admin == 'true') {
        User.findByIdAndRemove(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("User: " + user.name + " was deleted.");
        });
    }
    else {
        res.status(403).send({ auth: false, message: 'Not Allowed' });
    }
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', VerifyToken, function (req, res) {
    if (req.superuser == 'true' || req.admin == 'true') {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
    }
    else {
        res.status(403).send({ auth: false, message: 'Not Allowed' });
    }
});


router.put('/updatepass/:id', VerifyToken, function (req, res, next) {
    //console.log(req.body);
    if (req.superuser == 'true' || req.admin == 'true') {
        User.findById(req.userId, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found");
            if (user.username == req.params.id) {
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (passwordIsValid) {
                    var hashedPassword = bcrypt.hashSync(req.body.npass, 12);
                    User.updateOne({ username: user.username }, { $set: { password: hashedPassword } }, function (err, result) {
                        if (err) {
                            //console.log(err);
                            return res.status(500).send("There was a problem updating the user.")
                        };
                        res.status(200).send("updated-successfully");
                    });
                } else {
                    return res.status(401).send('Password mismatch');
                }
            } else {
                return res.status(405).send('Not Allowed');
            }
        });
    }
    else {
        res.status(403).send({ auth: false, message: 'Not Allowed' });
    }
});





module.exports = router;
