const accountRoutes = require('./account');
const locationRoutes = require('./location');
const weatherRoutes = require('./weather');
const flaskData = require('./flask');

const constructorMethod = (app) => {
  app.use('/account', accountRoutes);
  app.use('/location', locationRoutes);
  app.use('/weather', weatherRoutes);
  app.use('/flask', flaskData);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;