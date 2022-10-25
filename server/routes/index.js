const accountRoutes = require('./account');
const weatherRoutes = require('./weather');

const constructorMethod = (app) => {
  app.use('/weather', weatherRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;