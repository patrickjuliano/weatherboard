const express = require('express');
const app = express();
const { port } = require('./config');
const cors = require('cors');
app.use(cors());

app.listen(port, async () => {
    console.log('The server is up!');
    console.log(`Your routes will run on http://localhost:${port}`);
});