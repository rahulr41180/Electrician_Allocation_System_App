
const rawSiteDataModel = require("../model/rawSiteDataModel.js");

const electricianDataModel = require("../model/electricianDataModel.js");

// Function to sending raw sites data with pagination
const gettingAllRawSiteDataController = async (req, res) => {
    try {
        const currentPage = parseInt(req.params.currentPage) || 1;
        const rawSitesPerPage = parseInt(req.params.rawSitesPerPage) || 10;
        const skip = (currentPage - 1) * rawSitesPerPage;


        const rawSites = await rawSiteDataModel.find({})
            .skip(skip)
            .limit(rawSitesPerPage)
            .populate({
                path: "assignedElectritian",
                populate: {
                    path: "assignedSites"
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


// Function to quick update raw site with electrician
const quickUpdateAllRawSitesWithElectricianController = async (req, res) => {
    try {
        const updatesRawSitesWithGrievance = await rawSiteDataModel.find({})
        let status = false;

        // console.log('updatesRawSitesWithGrievance:', updatesRawSitesWithGrievance)
        for (const rawSite of updatesRawSitesWithGrievance) {
            try {
                if (rawSite?.grievance) {
                    // console.log('rawSite:', rawSite)
                    const electricianWithGrievance = await electricianDataModel.findOne(
                        { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                    )
                    // console.log('electricianWithGrievance:', electricianWithGrievance)

                    if (electricianWithGrievance) {
                        status = true;
                        const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: rawSite._id },
                            { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                        )
                        // console.log('updateRawSite:', updateRawSite)

                        const newAssignedSite = {

                            _id: rawSite._id,
                            electricianAssignDate: rawSite.installationDate
                        }
                        const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                            { _id: electricianWithGrievance._id },
                            { $push: { "assignedSites": newAssignedSite } }, { new: true }
                        )
                        // console.log('updateElectrician:', updateElectrician)
                    }

                } else if (!rawSite?.grievance) {
                    // console.log('rawSite 1:', rawSite)
                    const electricianWithOutGrievance = await electricianDataModel.findOne(
                        { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                    )
                    // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                    if (electricianWithOutGrievance) {
                        status = true;
                        const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                            { _id: rawSite._id },
                            { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
                        )
                        // console.log('updateRawSite:', updateRawSite)
                        const newAssignedSite = {
                            _id: rawSite._id,
                            electricianAssignDate: rawSite.installationDate
                        }
                        const updateElectrician = await electricianDataModel.findByIdAndUpdate(

                            { _id: electricianWithOutGrievance._id },
                            { $push: { "assignedSites": newAssignedSite } }, { new: true }
                        )
                        // console.log('updateElectrician:', updateElectrician)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }

        }

        return res.status(200).send({
            status: status ? true : false,
            message: status ? "Updated Successfully" : "Electrician Not Available"
        })

    } catch (error) {
        res.status(500).send({

            status: false,
            message: "Something Went Wrong Please try again later"
        })
    }

}

// Function to quick update pending electrician to raw sites
const quickUpdateAllPendingRawSitesWithElectricianController = async (req, res) => {

    try {
        const gettingAllPendingRawSites = await rawSiteDataModel.find({ $expr: { $lt: [{ $size: "$assignedElectritian" }, 1] } });
        // console.log('gettingAllPendingRawSites:', gettingAllPendingRawSites)
        let status = false;
        if (gettingAllPendingRawSites) {
            for (const rawSite of gettingAllPendingRawSites) {
                // console.log('rawSite:', rawSite)
                if (rawSite?.grievance) {
                    const electricianWithGrievance = await electricianDataModel.findOne(

                        { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                    )
                    // console.log('electricianWithGrievance:', electricianWithGrievance)
                    if (electricianWithGrievance) {
                        status = true;
                        const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: rawSite._id },
                            { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                        )

                        // console.log('updateRawSite:', updateRawSite)
                        const newAssignedSite = {
                            _id: rawSite._id,
                            electricianAssignDate: rawSite.installationDate
                        }
                        const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                            { _id: electricianWithGrievance._id },
                            { $push: { "assignedSites": newAssignedSite } }, { new: true }
                        )

                        // console.log('updateElectrician:', updateElectrician)
                    } else {
                        const electricianWithOutGrievance = await electricianDataModel.findOne(
                            { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                        )
                        // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                        if (electricianWithOutGrievance) {
                            status = false;
                            const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                                { _id: rawSite._id },
                                { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
                            )
                            // console.log('updateRawSite:', updateRawSite)
                            const newAssignedSite = {
                                _id: rawSite._id,
                                electricianAssignDate: rawSite.installationDate
                            }
                            const updateElectrician = await electricianDataModel.findByIdAndUpdate(

                                { _id: electricianWithOutGrievance._id },
                                { $push: { "assignedSites": newAssignedSite } }, { new: true }
                            )
                            // console.log('updateElectrician:', updateElectrician)
                        } else {
                            return res.status(200).send({
                                status: status ? true : false,
                                message: status ? "Updated Successfully" : "Electrician Not Available"
                            })

                        }
                    }
                } else if (!rawSite?.grievance) {
                    // console.log('rawSite:', rawSite)
                    const electricianWithOutGrievance = await electricianDataModel.findOne(
                        { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                    )
                    // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                    if (electricianWithOutGrievance) {

                        status = true;
                        // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
                        const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                            { _id: rawSite._id },
                            { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
                        )
                        // console.log('updateRawSite:', updateRawSite)
                        const newAssignedSite = {
                            _id: rawSite._id,

                            electricianAssignDate: rawSite.installationDate
                        }
                        const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                            { _id: electricianWithOutGrievance._id },
                            { $push: { "assignedSites": newAssignedSite } }, { new: true }
                        )
                        // console.log('updateElectrician:', updateElectrician)
                    } else {
                        const electricianWithGrievance = await electricianDataModel.findOne(

                            { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                        )
                        // console.log('electricianWithGrievance:', electricianWithGrievance)
                        if (electricianWithGrievance) {
                            status = true;
                            const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                                { _id: rawSite._id },
                                { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                            )

                            // console.log('updateRawSite:', updateRawSite)
                            const newAssignedSite = {
                                _id: rawSite._id,
                                electricianAssignDate: rawSite.installationDate
                            }
                            const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                                { _id: electricianWithGrievance._id },
                                { $push: { "assignedSites": newAssignedSite } }, { new: true }
                            )

                            // console.log('updateElectrician:', updateElectrician)
                        } else {
                            return res.status(200).send({
                                status: status ? true : false,
                                message: status ? "Updated Successfully" : "Electrician Not Available"
                            })
                        }
                    }
                } else {

                    res.status(500).send({
                        status: false,
                        message: "Something Went Wrong Please try again letter"
                    })
                }
            }
        } else {
            return res.status(200).send({
                status: false,
                message: "There are no sites pending"
            })
        }

        res.status(200).send({
            status: true,
        })
    } catch (error) {
        res.status(500).send({
            status: false,

            mesage: "Something Went Wrong Please try again later"
        })
    }
}

// Function to update raw site based on grievance profile of electrician
const singleRawSiteUpdateWithGrievanceElectrician = async (req, res) => {
    try {
        const rawSite = await rawSiteDataModel.findById({ _id: req.params.pId });

        if (rawSite?.grievance) {
            const electricianWithGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            // console.log('electricianWithGrievance:', electricianWithGrievance)
            if (electricianWithGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }

                )
                // console.log('updateRawSite:', updateRawSite)
                const newAssignedSite = {
                    _id: rawSite._id,
                    electricianAssignDate: rawSite.installationDate
                }
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithGrievance._id },
                    { $push: { "assignedSites": newAssignedSite } }, { new: true }

                )
                // console.log('updateElectrician:', updateElectrician)
            } else {
                return res.status(200).send({
                    status: false,
                    message: "Electrician Not Available"
                })
            }
        } else if (!rawSite?.grievance) {

            // console.log('rawSite 1:', rawSite)
            const electricianWithOutGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
            if (electricianWithOutGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }

                )
                // console.log('updateRawSite:', updateRawSite)
                const newAssignedSite = {
                    _id: rawSite._id,
                    electricianAssignDate: rawSite.installationDate
                }
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithOutGrievance._id },
                    { $push: { "assignedSites": newAssignedSite } }, { new: true }

                )
                // console.log('updateElectrician:', updateElectrician)
            } else {
                return res.status(200).send({
                    status: false,
                    message: "Electrician Not Available"
                })
            }
        }

        // console.log('rawSite:', rawSite)
        res.status(200).send({
            status: true,
            message: "Updated Successfully"
        })

    } catch (error) {
        res.status(500).send({
            status: false,

            message: "Something Went Wrong Please try again later"

        })
    }
}

// Function to update raw site with random electrician
const singleRawSiteUpdateWithAnyElectrician = async (req, res) => {
    try {

        const rawSite = await rawSiteDataModel.findById({ _id: req.params.pId });
        // console.log('rawSite:', rawSite);
        if (rawSite?.grievance) {
            const electricianWithGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
            )
            // console.log('electricianWithGrievance:', electricianWithGrievance)
            if (electricianWithGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(

                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                )
                // console.log('updateRawSite:', updateRawSite)
                const newAssignedSite = {
                    _id: rawSite._id,
                    electricianAssignDate: rawSite.installationDate
                }
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(

                    { _id: electricianWithGrievance._id },
                    { $push: { "assignedSites": newAssignedSite } }, { new: true }
                )
                // console.log('updateElectrician:', updateElectrician)
            } else {
                const electricianWithOutGrievance = await electricianDataModel.findOne(
                    { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                )
                // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)

                if (electricianWithOutGrievance) {
                    const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                        { _id: rawSite._id },
                        { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
                    )
                    // console.log('updateRawSite:', updateRawSite)
                    const newAssignedSite = {
                        _id: rawSite._id,
                        electricianAssignDate: rawSite.installationDate

                    }
                    const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                        { _id: electricianWithOutGrievance._id },
                        { $push: { "assignedSites": newAssignedSite } }, { new: true }
                    )
                    // console.log('updateElectrician:', updateElectrician)
                } else {
                    return res.status(200).send({
                        status: false,

                        message: "Electrician Not Available"
                    })
                }
            }
        } else if (!rawSite?.grievance) {
            // console.log('rawSite:', rawSite)
            const electricianWithOutGrievance = await electricianDataModel.findOne(
                { "grievanceElectrician": false, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "zone": { $elemMatch: { $eq: rawSite.city } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
            )

            // console.log('electricianWithOutGrievance:', electricianWithOutGrievance)
            if (electricianWithOutGrievance) {
                const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                    { _id: rawSite._id },
                    { $push: { "assignedElectritian": electricianWithOutGrievance._id } }, { new: true }
                )
                // console.log('updateRawSite:', updateRawSite)

                const newAssignedSite = {
                    _id: rawSite._id,
                    electricianAssignDate: rawSite.installationDate
                }
                const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                    { _id: electricianWithOutGrievance._id },
                    { $push: { "assignedSites": newAssignedSite } }, { new: true }
                )
                // console.log('updateElectrician:', updateElectrician)

            } else {

                const electricianWithGrievance = await electricianDataModel.findOne(
                    { "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites._id": { $ne: rawSite._id }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } }
                )
                // console.log('electricianWithGrievance:', electricianWithGrievance)
                if (electricianWithGrievance) {
                    const updateRawSite = await rawSiteDataModel.findByIdAndUpdate(
                        { _id: rawSite._id },
                        { $push: { "assignedElectritian": electricianWithGrievance._id } }, { new: true }
                    )

                    // console.log('updateRawSite:', updateRawSite)
                    const newAssignedSite = {
                        _id: rawSite._id,
                        electricianAssignDate: rawSite.installationDate
                    }
                    const updateElectrician = await electricianDataModel.findByIdAndUpdate(
                        { _id: electricianWithGrievance._id },
                        { $push: { "assignedSites": newAssignedSite } }, { new: true }
                    )

                } else {
                    return res.status(200).send({
                        status: false,
                        message: "Electrician Not Available"
                    })
                }
            }

            res.status(200).send({
                status: true,
                message: "Updated Successfully"
            })
        }

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message

        })
    }
}


// Function to updating raw site installation date
const updateInstallationDateOfRawSiteController = async (req, res) => {
    try {
        // console.log('req.body.installationDate:', req.body.installationDate)
        const installationDate = new Date(req.body.installationDate);

        // console.log('installationDate:', installationDate)
        const rawSiteUpdate = await rawSiteDataModel.findByIdAndUpdate(
            { _id: req.params.pId },
            { installationDate: installationDate }, { new: true }
        )

        if (!rawSiteUpdate) {
            res.status(200).send({
                status: false,

                message: "Something went wrong please try again"
            })
        }

        res.status(201).send({
            status: true,
            rawSiteUpdate: rawSiteUpdate,
            message: "Installation date has been changed successfully"
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Something went wrong please try again later"
        })
    }

}


// Function for getting total raw sites count
const gettingRawSitesCountController = async (req, res) => {
    try {
        const totalRawSites = await rawSiteDataModel.find({}).estimatedDocumentCount();
        // console.log('totalRawSites:', totalRawSites)

        res.status(200).send({
            status: true,
            totalRawSites: totalRawSites

        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Something went wrong please try again later"
        })
    }
}


module.exports = {
    gettingAllRawSiteDataController,
    quickUpdateAllRawSitesWithElectricianController,
    quickUpdateAllPendingRawSitesWithElectricianController,
    singleRawSiteUpdateWithGrievanceElectrician,
    singleRawSiteUpdateWithAnyElectrician,
    updateInstallationDateOfRawSiteController,
    gettingRawSitesCountController
}