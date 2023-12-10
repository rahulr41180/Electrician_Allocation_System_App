
const electricianDataModel = require("../model/electricianDataModel.js");

const gettingAllElectricianDataController = async (req, res) => {
    try {
        const allElectrician = await electricianDataModel.find({});

        res.status(200).send({
            status : true,
            allElectrician : allElectrician
        })
    } catch(error) {

        res.status(500).send({
            status : false,
            message : error.message
        })
    }
}

module.exports = {

    gettingAllElectricianDataController
}