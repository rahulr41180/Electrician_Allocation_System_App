
const mongoose = require("mongoose");

const electricianSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    phoneNumber : {
        type : String,
        require : true
    },

    zone : {
        type : [String]
    },
    assignedSites : [
        {
            type : mongoose.ObjectId,
            ref : "raw-site-data"
        }
    ],

    grievanceElectrician : {
        type : Boolean
    }
}, {
    timestamps : true
})


module.exports = mongoose.model("electrician-data", electricianSchema);