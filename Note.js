
/*

const electricianWithGrievance = await electricianDataModel.findOne({ "grievanceElectrician": true, "_id": { $nin: rawSite.assignedElectritian }, "assignedSites": { $elemMatch: { $ne: rawSite._id } }, "$expr": { $lt: [{ $size: "$assignedSites" }, 3] } })
*/