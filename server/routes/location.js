const express = require('express');
const router = express.Router();
const data = require('../data');
const locationData = data.location;
const validation = require('../validation');

router.get('/name', async (req, res) => {
    try {
        req.query.name = validation.checkString(req.query.name); // TODO: Write validation function that parses location format
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getLocationByName(req.query.name);
        if (data.length === 0) throw 'Location not found';
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/zipcode', async (req, res) => {
    try {
        req.query.zipCode = validation.checkString(req.query.zipCode); // TODO: Write validation function that parses code format
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getLocationByZipCode(req.query.zipCode);
        if (data.length === 0) throw 'Location not found';
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/coordinates', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getLocationByCoordinates(req.query.lat, req.query.lon);
        if (data.length === 0) throw 'Location not found';
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;