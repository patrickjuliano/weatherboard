const express = require('express');
const app = express();

const redis = require('redis');
const client = redis.createClient();

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    req.redisClient = client;
    next();
});

const configRoutes = require('./routes');
configRoutes(app);

const { port } = require('./config');

app.listen(port, async () => {
    await client.connect();
    console.log('The server is up!');
    console.log(`Your routes will run on http://localhost:${port}`);
});