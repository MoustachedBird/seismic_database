const express = require('express');
const router = express.Router(); //Router module for creating the server routes

/*import datalogger controller */
const dataloggerCtrl = require('../controllers/datalogger.controller');

router.get('/:time_start/:time_end/:resolution/:show_sensors',dataloggerCtrl.main);
router.post('/',dataloggerCtrl.storeIntoDB);

module.exports = router;