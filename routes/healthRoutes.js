const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: "ok",
        service: "Brand Tracker API",
        timestamp: Date.now()
    });
});

module.exports = router;
