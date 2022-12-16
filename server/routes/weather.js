const express = require('express');
const router = express.Router();
const flat = require('flat');
const unflatten = flat.unflatten;
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
router.get('/historical', async (req, res) => {
    try {
        req.query.lat = validation.checkNumber(req.query.lat);
        req.query.lon = validation.checkNumber(req.query.lon);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const dt = Math.round((Date.now() / 1000));
        console.log(dt);
        const date = (new Date(dt * 1000)).toLocaleDateString();
        const coordinates = `${req.query.lat},${req.query.lon}`;

        console.log(date);

        let previousDate = await req.redisClient.hGet('dates', coordinates);
        if (!previousDate) {
            console.log("Adding date...");

            const data = { date: date };
            const flatData = flat(data);
            await req.redisClient.hSet('dates', coordinates, JSON.stringify(flatData));
        }
        else {
            console.log("Date found!");
        }

        let previousDateString;
        if (previousDate) {
            const flatData = JSON.parse(previousDate);
            previousDateString = unflatten(flatData.date);
        }
        const weather = await req.redisClient.hGet('weather', coordinates);
        if (!previousDate || previousDateString !== date || !weather) {
            console.log("Adding weather data...");

            console.log(1);
            const data = await weatherData.getHistoricalWeather(req.query.lat, req.query.lon, dt);
            console.log(2);
            await req.redisClient.hSet('weather', coordinates, JSON.stringify(data));
            console.log(3);
            return res.status(200).json(data);
        }
        else {
            console.log("Weather data found!");

            const data = JSON.parse(weather);
            return res.status(200).json(data);
        }
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;