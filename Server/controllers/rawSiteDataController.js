
const rawSiteDataModel = require("../model/rawSiteDataModel.js");

const electricianDataModel = require("../model/electricianDataModel.js");

const gettingAllRawSiteDataController = async (req, res) => {
    try {
        const rawSites = await rawSiteDataModel.find({})
        .populate({
            path : "assignedElectritian",
            populate : {
                path : "assignedSites"

            }
        })

        res.status(200).send({
            status: true,
            rawSites: rawSites,

        })
    } catch (error) {

        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


const quickUpdateAllRawSitesWithElectricianController = async (req, res) => {
    try {

        const updatesRawSitesWithGrievance = await rawSiteDataModel.find({ "grievance": true })
        console.log('updatesRawSitesWithGrievance:', updatesRawSitesWithGrievance)
        for (const element of updatesRawSitesWithGrievance) {
            try {
                const grievanceElectrician = await electricianDataModel.findOne({ "grievanceElectrician": true, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } });
                console.log('grievanceElectrician:', grievanceElectrician)


                if (grievanceElectrician) {
                    console.log('element:', element)
                    const isAlreadyAssigned = element.assignedElectritian.includes(grievanceElectrician._id);
                    if (!isAlreadyAssigned) {
                        let updateRawSitesWithElectrician = await rawSiteDataModel.findByIdAndUpdate(
                            {
                                _id: element._id,
                                // "assignedElectritian": {
                                //     $not: {
                                //         $elemMatch: { $eq: grievanceElectrician._id }
                                //     }
                                // }
                            },
                            { $push: { "assignedElectritian": grievanceElectrician._id } }, { new: true }
                        )
                        console.log('updateRawSitesWithElectrician:', updateRawSitesWithElectrician)
                        let grievanceElectricianUpdate = await electricianDataModel.findByIdAndUpdate(
                            { _id: grievanceElectrician._id },
                            { $push: { "assignedSites": element._id } }, { new: true }

                        )
                        console.log('grievanceElectricianUpdate:', grievanceElectricianUpdate)
                    }
                }

            } catch (error) {
                console.log(error.message)
            }
        }

        const updatesRawSitesWithOutGrievance = await rawSiteDataModel.find({ "grievance": false });

        for (const element of updatesRawSitesWithOutGrievance) {
            try {
                const withoutGrievanceElectrician = await electricianDataModel.findOne({ "grievanceElectrician": false, zone: { $elemMatch: { $eq: element.city } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } });
                console.log('element:', element)
                console.log('withoutGrievanceElectrician:', withoutGrievanceElectrician)

                if (withoutGrievanceElectrician) {
                    const isAlreadyAssigned = element.assignedElectritian.includes(withoutGrievanceElectrician._id);
                    console.log('isAlreadyAssigned:', isAlreadyAssigned)
                    const cityInZone = withoutGrievanceElectrician.zone.includes(element.city);
                    console.log('cityInZone:', cityInZone)


                    if (!isAlreadyAssigned) {
                        let updateRawSitesWithOutElectrician = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: element._id },
                            { $push: { "assignedElectritian": withoutGrievanceElectrician._id } }, { new: true }
                        )
                        console.log('updateRawSitesWithOutElectrician:', updateRawSitesWithOutElectrician)
                        let withoutGrievanceElectricianUpdate = await electricianDataModel.findByIdAndUpdate(
                            { _id: withoutGrievanceElectrician._id },
                            { $push: { "assignedSites": element._id } }, { new: true }
                        )
                        console.log('withoutGrievanceElectricianUpdate:', withoutGrievanceElectricianUpdate)
                    }
                }
            } catch (error) {

            }
        }



        return res.status(200).send({
            status: true,

        })

    } catch (error) {

    }

}

const quickUpdateAllPendingRawSitesWithElectricianController = async (req, res) => {
    try {

        const gettingAllPendingRawSites = await rawSiteDataModel.find({ $expr: { $lt: [{ $size: "$assignedElectritian" }, 1] } });

        if (gettingAllPendingRawSites) {
            for (const element of gettingAllPendingRawSites) {
                console.log('element:', element)
                const grievanceElectrician = await electricianDataModel.findOne({ $expr: { $lt: [{ $size: "$assignedSites" }, 3] } });
                if (grievanceElectrician && grievanceElectrician.grievanceElectrician) {
                    const isAlreadyAssigned = element.assignedElectritian.includes(grievanceElectrician._id);

                    console.log('grievanceElectrician: true', grievanceElectrician);
                    if (!isAlreadyAssigned) {

                        let updateRawSitesWithElectrician = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: element._id },
                            { $push: { "assignedElectritian": grievanceElectrician._id } }, { new: true }
                        )
                        console.log('updateRawSitesWithElectrician:', updateRawSitesWithElectrician)
                        let updateGrievanceElectricianUpdate = await electricianDataModel.findByIdAndUpdate(
                            { _id: grievanceElectrician._id },
                            { $push: { "assignedSites": element._id } }, { new: true }
                        )
                        console.log('updateGrievanceElectricianUpdate:', updateGrievanceElectricianUpdate)

                    }
                } else if (grievanceElectrician && !grievanceElectrician.grievanceElectrician) {
                    console.log('grievanceElectrician: false', grievanceElectrician);
                    const isAlreadyAssigned = element.assignedElectritian.includes(grievanceElectrician._id);
                    const withoutGrievanceElectrician = await electricianDataModel.findOne({ "grievanceElectrician": false, zone: { $elemMatch: { $eq: element.city } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } });

                    console.log('withoutGrievanceElectrician:', withoutGrievanceElectrician);

                    if (withoutGrievanceElectrician && !isAlreadyAssigned) {
                        let updateRawSitesWithElectrician = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: element._id },
                            { $push: { "assignedElectritian": withoutGrievanceElectrician._id } }, { new: true }
                        )
                        console.log('updateRawSitesWithElectrician:', updateRawSitesWithElectrician)
                        let updateGrievanceElectricianUpdate = await electricianDataModel.findByIdAndUpdate(
                            { _id: withoutGrievanceElectrician._id },
                            { $push: { "assignedSites": element._id } }, { new: true }
                        )
                        console.log('updateGrievanceElectricianUpdate:', updateGrievanceElectricianUpdate)
                    }
                } else {
                    return res.status(200).send({
                        status: true,
                        gettingAllPendingRawSites: gettingAllPendingRawSites
                    })
                }
            }

        }

        res.status(200).send({
            status: true,
        })


    } catch (error) {

    }

}

const singleRawSiteUpdateWithGrievanceElectrician = async (req, res) => {
    try {
        const rawSite = await rawSiteDataModel.findById({ _id: req.params.pId });


        if (rawSite?.grievance) {
            const electricianWithGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": true, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            console.log('electricianWithGrievance:', electricianWithGrievance)
            if (electricianWithGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                )
                console.log('updateRawSite:', updateRawSite)
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithGrievance._id },
                    { $push: { "assignedSites": rawSite._id } }, { new: true }
                )
                console.log('updateElectrician:', updateElectrician)
            }

        } else if (!rawSite?.grievance) {
            console.log('rawSite 1:', rawSite)
            const electricianWithOutGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": false, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, zone: { $elemMatch: { $eq: rawSite.city } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
            if(electricianWithOutGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }

                )
                console.log('updateRawSite:', updateRawSite)
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithOutGrievance._id },
                    { $push: { "assignedSites": rawSite._id } }, { new: true }
                )
                console.log('updateElectrician:', updateElectrician)
            }
        }

        console.log('rawSite:', rawSite)
        res.status(200).send({
            status: true
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message

        })
    }
}

const singleRawSiteUpdateWithAnyElectrician = async (req, res) => {
    try {
        const rawSite = await rawSiteDataModel.findById({ _id: req.params.pId });
        console.log('rawSite:', rawSite);

        if(rawSite?.grievance) {
            const electricianWithGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": true, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            console.log('electricianWithGrievance:', electricianWithGrievance)
            if(electricianWithGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                )
                console.log('updateRawSite:', updateRawSite)
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithGrievance._id },
                    { $push: { "assignedSites": rawSite._id } }, { new: true }
                )
                console.log('updateElectrician:', updateElectrician)
            } else {
                const electricianWithOutGrievance = await electricianDataModel.findOne(
                    { "grievanceElectrician": false, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, zone: { $elemMatch: { $eq: rawSite.city } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
                )
                
                console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                if(electricianWithOutGrievance) {
                    const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                        { _id: rawSite._id },
                        { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
    
                    )
                    console.log('updateRawSite:', updateRawSite)
                    const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                        { _id: electricianWithOutGrievance._id },
                        { $push: { "assignedSites": rawSite._id } }, { new: true }
                    )
                    console.log('updateElectrician:', updateElectrician)
                }
            }
        } else if(!rawSite?.grievance) {
            console.log('rawSite:', rawSite)
            const electricianWithGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": true, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            console.log('electricianWithGrievance:', electricianWithGrievance)
            if(electricianWithGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                )
                console.log('updateRawSite:', updateRawSite)
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithGrievance._id },
                    { $push: { "assignedSites": rawSite._id } }, { new: true }
                )
                console.log('updateElectrician:', updateElectrician)
            } else {
                console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                const electricianWithOutGrievance = await electricianDataModel.findOne(
                    { "grievanceElectrician": false, _id: { $nin: rawSite.assignedElectritian }, assignedSites: { $elemMatch: { $ne: rawSite._id } }, zone: { $elemMatch: { $eq: rawSite.city } }, $expr: { $lt: [{ $size: "$assignedSites" }, 3] } }
                )
                
                if(electricianWithOutGrievance) {
                    const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                        { _id: rawSite._id },
                        { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
    
                    )
                    console.log('updateRawSite:', updateRawSite)
                    const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                        { _id: electricianWithOutGrievance._id },
                        { $push: { "assignedSites": rawSite._id } }, { new: true }
                    )
                    console.log('updateElectrician:', updateElectrician)
                }
            }

        } else {
            res.status(500).send({
                status : false,
                message : error.message
            })
        }

        res.status(200).send({
            status : true
        })

    } catch(error) {
        res.status(500).send({
            status : false,

            message : error.message
        })
    }
}

const updateInstallationDateOfRawSiteController = async (req, res) => {
    try {

        const installationDate = new Date(req.body.installationDate);
        console.log('installationDate:', installationDate)
        const rawSiteUpdate = await rawSiteDataModel.findByIdAndUpdate(
            { _id : req.params.pId },
            { installationDate : installationDate }, {new : true}
        )

        if(!rawSiteUpdate) {
            res.status(500).send({

                status : false,
                message : error.message
            })
        }

        res.status(201).send({
            status : true,
            rawSiteUpdate : rawSiteUpdate
        })
    } catch(error) {

    }

}

module.exports = {
    gettingAllRawSiteDataController,
    quickUpdateAllRawSitesWithElectricianController,
    quickUpdateAllPendingRawSitesWithElectricianController,
    singleRawSiteUpdateWithGrievanceElectrician,
    singleRawSiteUpdateWithAnyElectrician,

    updateInstallationDateOfRawSiteController
}