const express = require('express');
const router = express.Router();
const data = require('../data');
const weatherData = data.weather;
const validation = require('../validation');

router.get('/current/:location', async (req, res) => {
    try {
        req.params.location = validation.checkString(req.params.location);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getCurrentWeather(req.params.location);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;