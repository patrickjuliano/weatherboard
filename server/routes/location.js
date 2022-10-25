const express = require('express');
const router = express.Router();
const data = require('../data');
const locationData = data.location;
const validation = require('../validation');

router.get('/bylocation', async (req, res) => {
    try {
        req.query.location = validation.checkString(req.query.location); // TODO: Write validation function that parses location format
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getCoordinatesByLocation(req.query.location);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/byzipcode', async (req, res) => {
    try {
        req.query.zipCode = validation.checkString(req.query.zipCode); // TODO: Write validation function that parses code format
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getCoordinatesByLocation(req.query.zipCode);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/bycoordinates', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await locationData.getCoordinatesByLocation(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;