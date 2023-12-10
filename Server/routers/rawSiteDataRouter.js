
const express = require("express");

const router = express.Router();

const { 
    gettingAllRawSiteDataController, 
    quickUpdateAllRawSitesWithElectricianController, 
    quickUpdateAllPendingRawSitesWithElectricianController, 
    singleRawSiteUpdateWithGrievanceElectrician, 
    singleRawSiteUpdateWithAnyElectrician,
    updateInstallationDateOfRawSiteController

} = require("../controllers/rawSiteDataController.js");

// Getting All Raw Site Data || METHOD : GET
router.get("/get-all-rawsitedata", gettingAllRawSiteDataController);

// Update Quick All Raw Sites With Electrician || METHOD : GET
router.get("/quick-update-all-raw-sites", quickUpdateAllRawSitesWithElectricianController);

// Update Quick Pending Electrician To Pending Raw Sites || METHOD : GET
router.get("/quick-update-all-pending-raw-sites", quickUpdateAllPendingRawSitesWithElectricianController);

// Update Single Raw Site With Electrician || METHOD : GET
router.get("/single-raw-site-update/:pId", singleRawSiteUpdateWithGrievanceElectrician);

// Update Single Raw Site With or Without Gravience || METHOD : GET
router.get("/single-raw-site-update-with-any-electrician/:pId", singleRawSiteUpdateWithAnyElectrician);

// Update Installation Date of Raw Site || METHOD : PUT
router.put("/update-installation-date-of-raw-site/:pId", updateInstallationDateOfRawSiteController);

module.exports = router;