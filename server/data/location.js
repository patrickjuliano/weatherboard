const axios = require('axios');
const { apiKey, apiEndpoint } = require('../config');
const validation = require('../validation');

async function getCoordinatesByLocation(location) {

}

async function getCoordinatesByZipCode(zipCode) {

}

async function getLocationByCoordinates(lat, lon) {

}

module.exports = {
    getCoordinatesByLocation,
    getCoordinatesByZipCode,
    getLocationByCoordinates
}