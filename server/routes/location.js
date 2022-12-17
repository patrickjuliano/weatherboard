const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../data');
const locationData = data.location;
const validation = require('../validation');

router.get('/name', async (req, res) => {
    try {
        req.query.name = validation.checkString(xss(req.query.name));
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getLocationByName(req.query.name);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/coordinates', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(xss(req.query.lat));
        req.query.lon = validation.checkNumber(xss(req.query.lon));
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getLocationByCoordinates(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;