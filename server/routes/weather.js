const express = require('express');
const router = express.Router();
const data = require('../data');
const weatherData = data.weather;
const validation = require('../validation');

// Requires numerical values for the query parameters lat and lon
router.get('/current', async (req, res) => {
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
router.get('/minutely', async (req, res) => {
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
router.get('/hourly', async (req, res) => {
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
router.get('/daily', async (req, res) => {
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
router.get('/alerts', async (req, res) => {
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

// Requires numerical values for the query parameters lat and lon
router.get('/historical/:dt', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
        req.params.dt = validation.checkTimestamp(req.params.dt);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const data = await weatherData.getHistoricalWeather(req.query.lat, req.query.lon, req.params.dt);
        res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;