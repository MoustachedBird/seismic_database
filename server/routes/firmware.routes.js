const express = require('express');
const router = express.Router(); //Router module for creating the server routes

/*import datalogger controller */
const firmwareCtrl = require('../controllers/firmware.controller');

router.get('/',firmwareCtrl.main);
router.get('/latest.info',firmwareCtrl.latest);

module.exports = router;