var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var bouncer = require('./bouncer');
var bcrypt = require('bcryptjs');
var path = require('path');
var pug = require('pug');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var config = require('../../config');

// const resetpasswordmail = pug.compileFile(path.join(__dirname, '../../views/resetPasswordMail.pug'));

function generate_resetpasswordmail(time, name, url) {
    return ''
    // resetpasswordmail({ time: time, name: name, url: url });
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
        from: 'Student Profile Management System <' + config.emailConfig.username + '>',
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

        if (!user.active) return res.status(400).send({ auth: false, token: null, message: 'Account Not Active' });

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(400).send({ auth: false, token: null, message: 'Invalid Credentials' });

        var roles = "User"

        if (user.isAdmin) {
            roles += ',Admin'
        }

        if (user.isSuperuser) {
            roles += ',Superuser'
        }

        if (user.isFaculty) {
            roles += ',Faculty'
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

router.post('/register', async function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 12);
    var data = {
        username: req.body.username,
        name: req.body.name,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        active: true,
    }

    var user = await User.findOne({ username: data.username });

    if (user) {
        res.status(400).send({ message: "Username Already Exists" })
        return;
    }

    try {
        user = await User.create(data);
        res.status(200).send(user);
        return;
    }
    catch (error) {
        res.status(500).send({ message: error.toString() });
        return;
    }
});

router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0, _id: 0, __v: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send({ 'data': user, 'roles': req.roles });
    });

});

module.exports = router;