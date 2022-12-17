const express = require('express');
const router = express.Router();
const data = require('../data');
const accountData = data.account;
const validation = require('../validation');

router.get('/:id', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.getUser(req.params.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/:id', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.createUser(req.params.id);
        if (data._id) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({error: 'Internal Server Error'});
        }
    } catch (e) {
        return res.status(404).json({error: e}); // TODO: Status?
    }
});

router.post('/:id/location', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
        req.query.name = validation.checkString(req.query.name);
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
        req.query.country = validation.checkString(req.query.country);
        if ('state' in req.query) req.query.state = validation.checkString(req.query.state);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.addLocation(req.params.id, req.query.name, req.query.lat, req.query.lon, req.query.country, 'state' in req.query ? req.query.state : null);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e}); // TODO: Status?
    }
});

router.delete('/:id/location', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
        req.query.name = validation.checkString(req.query.name);
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.removeLocation(req.params.id, req.query.name, req.query.lat, req.query.lon);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e}); // TODO: Status?
    }
});

router.get('/pfpicon/:id', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.getPfpIcon(req.params.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/pfpmain/:id', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await accountData.getPfpMain(req.params.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/:id/profilepicture', async (req, res) => {
    try {
        req.params.id = validation.checkString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        await accountData.formatAndSetImage(req.files.img, req.params.id);
    } catch (e) {
        return res.status(500).json({error: e});
    }
});

module.exports = router;