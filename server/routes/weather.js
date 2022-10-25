const express = require('express');
const router = express.Router();
const data = require('../data');
const weatherData = data.weather;
const validation = require('../validation');

// Requires numerical values for the query parameters lat and lon
router.get('/weather/current', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getCurrentWeather(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

// Requires numerical values for the query parameters lat and lon
router.get('/weather/minutely', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getMinutelyWeather(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

// Requires numerical values for the query parameters lat and lon
router.get('/weather/hourly', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getHourlyWeather(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

// Requires numerical values for the query parameters lat and lon
router.get('/weather/daily', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getDailyWeather(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

// Requires numerical values for the query parameters lat and lon
router.get('/weather/alerts', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getWeatherAlerts(req.query.lat, req.query.lon);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;