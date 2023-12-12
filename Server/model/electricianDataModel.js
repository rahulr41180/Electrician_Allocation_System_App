
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
            _id : {
                type : mongoose.ObjectId,
                ref : "raw-site-data" 
            },

            electricianAssignDate : {
                type : Date,
                default : Date.now
            }
        }
    ],

    grievanceElectrician : {
        type : Boolean
    }
}, {
    timestamps : true
})


module.exports = mongoose.model("electrician-data", electricianSchema);