
const mongoose = require("mongoose");

const rawSiteSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    phone : {
        type : Number,
        require : true
    },

    city : {
        type : String
    },
    assignedElectritian : [
        {
            type : mongoose.ObjectId,
            ref : "electrician-data"
        }
    ],

    installationDate : {
        type : Date,
        default : Date.now
    },
    grievance : {
        type : Boolean
    }
}, {
    timestamps : true

})


module.exports = mongoose.model("raw-site-data", rawSiteSchema);