const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  apiKey: process.env.API_KEY,
  apiEndpoint: 'https://api.openweathermap.org'
};