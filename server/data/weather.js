const axios = require('axios');
const { apiKey, apiEndpoint } = require('../config');
const validation = require('../validation');

async function getCurrentWeather(location) {
  location = validation.checkString(location);

  console.log(`${apiEndpoint}/current?access_key=${apiKey}&query=${location}`);
  let { data } = await axios.get(`${apiEndpoint}/current?access_key=${apiKey}&query=${location}`);
  return data;
}

module.exports = {
  getCurrentWeather
}