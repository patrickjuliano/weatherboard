const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/data/:city/:periods', async (req, res) => {
    try {
        let city = req.params.city;
        let periods = parseInt(req.params.periods);
        let flask_data = await axios.get(`http://127.0.0.1:8000/` + city + '/' + periods);
        res.json({ home: flask_data.data });
    }catch (e) {
        res.status(404).json({ error: e });
    }
});

module.exports = router;