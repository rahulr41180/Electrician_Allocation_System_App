
const express = require("express");

const router = express.Router();

const { gettingAllElectricianDataController } = require("../controllers/electricianDataController.js");

router.get("/get-all-electriciandata", gettingAllElectricianDataController);

module.exports = router;