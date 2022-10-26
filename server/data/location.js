const axios = require('axios');
const { apiKey, apiEndpoint } = require('../config');
const validation = require('../validation');

async function getCoordinatesByLocation(location) {
    location = validation.checkString(location); // TODO: Write validation function that parses location format

    console.log(`${apiEndpoint}/geo/1.0/direct?q=${location}&units=imperial&appid=${apiKey}`);
    let { data } = await axios.get(`${apiEndpoint}/geo/1.0/direct?q=${location}&appid=${apiKey}`);
    return data;
}

async function getCoordinatesByZipCode(zipCode) {
    // TODO: Write validation function that parses code format
}

async function getLocationByCoordinates(lat, lon) {
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);

    let { data } = await axios.get(`${apiEndpoint}/geo/1.0/reverse?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
    return data;
}

module.exports = {
    getCoordinatesByLocation,
    getCoordinatesByZipCode,
    getLocationByCoordinates
}