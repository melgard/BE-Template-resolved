const express = require('express');
const router = express.Router();

const {getProfile} = require('../middleware/getProfile');

/*
  # Controllers
 */
const { adminController } = require('../controllers/admin');
const { jobsController } = require('../controllers/jobs');
const { contractsController } = require('../controllers/contracts');


router.use('/contracts', [getProfile], contractsController);
router.use('/jobs', [getProfile], jobsController);
router.use('/admin', [getProfile], adminController);


module.exports = {
  v1: router
};
