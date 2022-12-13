const axios = require('axios');
const { apiKey, apiEndpoint } = require('../config');
const validation = require('../validation');

async function getLocationByName(location) {
    location = validation.checkString(location);

    let { data } = await axios.get(`${apiEndpoint}/geo/1.0/direct?q=${location}&limit=0&units=imperial&appid=${apiKey}`);
    if (data.length === 0) throw 'Location not found';
    return data;
}

async function getLocationByZipCode(zipCode) {
    // TODO: Write validation function that parses code format
}

async function getLocationByCoordinates(lat, lon) {
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);

    let { data } = await axios.get(`${apiEndpoint}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=0&units=imperial&appid=${apiKey}`);
    if (data.length === 0) throw 'Location not found';
    return data;
}

async function getSpecificLocation(name, lat, lon) {
    name = validation.checkString(name);
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);

    let data = await getLocationByName(name);
    let location = data.find((location) => location.lat === lat && location.lon === lon);
    if (location === undefined) throw 'Location not found';
    return location;
}

module.exports = {
    getLocationByName,
    getLocationByZipCode,
    getLocationByCoordinates,
    getSpecificLocation
}