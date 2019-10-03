var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var path = require('path');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var VerifyToken = require('../auth/VerifyToken');

router.use(fileUpload());

router.put('/upload/:username?', VerifyToken, async function (req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    try {
        var certificate = req.files.certificate;
        const fileName = '../data/' + username + '/certificates/' + certificate.name;
        const X = await fs.ensureFile(fileName);
        const A = await certificate.mv(fileName);
        return res.status(200).send({ message: 'File uploaded!' });
    }
    catch (error) {
        return res.status(500).send({ message: error.toString() });
    }

});

router.get('/download/:username?', VerifyToken, async function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    const filename = '../data/' + username + '/certificates/' + req.query.fileName;

    console.log(filename);

    if (!(await fs.exists(filename)))
        return res.status(404).send({ message: 'No Filles!' });

    res.status(200).sendFile(path.join(__dirname, '../../', filename));

});


router.get('/:username?', VerifyToken, async function (req, res) {
    if (req.params.username && !(req.superuser == 'true' || req.admin == 'true'))
        return res.status(403).send({ auth: false, message: 'Not Allowed' });

    const username = req.params.username || req.username;

    const dirname = '../data/' + username + '/certificates/'

    if (!(await fs.exists(dirname)))
        return res.status(404).send({ message: 'No Files!' });

    try {
        const A = await fs.readdir(dirname);
        return res.status(200).send({ data: A })
    }
    catch (error) {
        return res.status(200).send({ message: error.toString() });
    }

});


module.exports = router;