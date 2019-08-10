var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var IsAdmin = require('../isAdmin/isAdmin')
var IsSuperuser = require('../isSuperuser/IsSuperuser')
var IsFinanceAdmin = require('../isFinanceAdmin/IsFinanceAdmin');
var IsVendor = require('../isVendor/IsVendor');
var UserHardCash = require('../userHardCash/UsernameHardCash');
var IsFoodAdmin = require('../isFoodAdmin/IsFoodAdmin');
var bouncer = require('./bouncer');
var bcrypt = require('bcryptjs');
var path = require('path');
var pug = require('pug');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var config = require('../../config');

const resetpasswordmail = pug.compileFile(path.join(__dirname, '../../views/resetPasswordMail.pug'));

function generate_resetpasswordmail(time, name, url) {
    return resetpasswordmail({ time: time, name: name, url: url });
}

async function send_mail(email, sub, message) {
    const transporter = await nodemailer.createTransport({
        host: config.emailConfig.host,
        port: config.emailConfig.port,
        secure: config.emailConfig.secure,
        auth: {
            user: config.emailConfig.username,
            pass: config.emailConfig.password
        }
    });
    const mailOptions = {
        from: 'Amrita E Wallet <' + config.emailConfig.username + '>',
        to: email,
        subject: sub,
        html: message
    };
    const A = await transporter.sendMail(mailOptions);
    return A;
}

//Change Password

async function changePassword(oldPassword, newPassword, username) {

    const A = await User.findOne({ username: username });
    if (!A)
        throw new Error("Invalid username. Please try again");
    var passwordIsValid = bcrypt.compareSync(A.password, oldPassword);
    if (!passwordIsValid)
        throw new Error("Invalid Password. Please try again");
    var hashedPassword = bcrypt.hashSync(newPassword, 12);
    const B = await User.findOneAndUpdate({ username: username }, { $set: { password: hashedPassword } });
    var ret = { message: "Password changed successfully" };
    return ret;
}


router.post('/changepassword', function (req, res) {
    changePassword(req.body.oldPassword, req.body.newPassword, req.body.username).then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


//Reset Password

async function finalresetpassword(obj) {

    var token = obj.jwt.split('+')[0];
    // console.log(token);
    // console.log(obj.password);
    var password = obj.password;
    var decoded = await jwt.verify(token, config.secret);
    var A = await User.findOne({ username: decoded.username });
    if (!A)
        throw new Error('Token Invalid.');
    var hashedPassword = bcrypt.hashSync(password, 12);
    var B = await User.findOneAndUpdate({ username: decoded.username }, { $set: { password: hashedPassword } });
    // console.log(B);
    return { message: "Password Reset Successfull" };
}


router.post('/finalresetpassword', function (req, res) {
    finalresetpassword(req.body).then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


async function initiateresetPassword(username) {

    var A = await User.findOne({ username: username });
    var email;
    var name;
    if (!A) {
        var C = await User.findOne({ email: username });
        if (!C)
            throw new Error('Username/ Email does not exist.');
        username = C.username;
        email = C.email;
        name = C.name;
    }
    else {
        email = A.email;
        name = A.name;
    }
    var token = jwt.sign({ username: username }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    var url = config.domain + 'resetpassword?token=' + token;

    var B = await send_mail(email, 'Reset Password Request', generate_resetpasswordmail('24 hours', name, url));

    if (!B)
        throw new Error('Mail not sent.');
    return { message: "Mail Sent Successfully. Follow instrunctions in your mail." };
}

router.post('/initiateresetpassword', function (req, res) {
    initiateresetPassword(req.body.username).then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


router.post('/login', bouncer.block, function (req, res) {

    User.findOne({ username: req.body.username }, async function (err, user) {
        if (err) return res.status(500).send({ message: err.toString() });
        if (!user) return res.status(400).send({ message: 'Invalid Credentials' });


        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(400).send({ auth: false, token: null, message: 'Invalid Credentials' });

        var roles = "User"

        var user_ = await IsVendor.findOne({ username: req.body.username });
        if (user_) {
            if (user_.isVendor) {
                roles = 'Vendor'
            }
        }

        var user_ = await IsAdmin.findOne({ username: req.body.username });
        if (user_) {
            if (user_.isAdmin) {
                roles += ',Admin'
            }
        }

        var user_ = await IsFoodAdmin.findOne({ username: req.body.username });
        if (user_) {
            if (user_.isFoodAdmin) {
                roles += ',FoodAdmin'
            }
        }

        var user_ = await IsFinanceAdmin.findOne({ username: req.body.username });
        if (user_) {
            if (user_.isFinanceadmin) {
                roles += ',FinanceAdmin'
            }
        }


        user_ = await IsSuperuser.findOne({ username: req.body.username });
        if (user_) {
            if (user_.isSuperuser) {
                roles += ',Superuser'
            }
        }


        var token = jwt.sign({ id: user._id, roles: roles, username: user.username }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        bouncer.reset(req);
        res.status(200).send({ auth: true, token: token });
    });

});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

// router.post('/register', async function (req, res) {

//     console.log(req.body);

//     const obj = req.body;

//     const session = await mongoose.startSession();
//     await session.startTransaction();

//     try {

//         var newUser = new User({
//             name: obj.name,
//             username: obj.username,
//             password: obj.password,
//             phoneNumber: obj.phoneNumber
//         });
//         var ret3 = await newUser.save();
//         var newisAdmin = new IsAdmin({
//             username: obj.username,
//             isAdmin: false
//         });
//         ret3 = await newisAdmin.save();

//         var newisSuperuser = new IsSuperuser({
//             username: obj.username,
//             isSuperuser: false
//         });
//         ret3 = await newisSuperuser.save();


//         var newisVendor = new IsVendor({
//             username: obj.username,
//             isVendor: false
//         });
//         ret3 = await newisVendor.save();


//         var newisFinanceAdmin = new IsFinanceAdmin({
//             username: obj.username,
//             isFinanceadmin: false
//         });
//         ret3 = await newisFinanceAdmin.save();

//         var newisFoodAdmin = new IsFoodAdmin({
//             username: obj.username,
//             IsFoodAdmin: false
//         });
//         ret3 = await newisFoodAdmin.save();

//         var newUserHardCash = new UserHardCash({
//             username: obj.username,
//             amount: parseFloat(0)
//         });
//         ret3 = await newUserHardCash.save();


//         await session.commitTransaction();
//         await session.endSession();

//         var token = jwt.sign({ id: user._id, roles: 'User', username: user.username }, config.secret, {
//             expiresIn: 86400
//         });

//         res.status(200).send({ auth: true, token: token, username: req.body.username });

//     } catch (error) {
//         await session.abortTransaction();
//         await session.endSession();
//         res.status(400).send("There was a problem registering the user. " + error.toString());
//     }

// });

router.get('/me', VerifyToken, function (req, res, next) {
    // console.log(req.userId);
    User.findById(req.userId, { password: 0, _id: 0, __v: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send({ 'data': user, 'roles': req.roles });
    });

});

module.exports = router;