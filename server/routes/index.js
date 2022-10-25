const weatherRoutes = require('./weather');

const constructorMethod = (app) => {
  app.use('/', weatherRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;