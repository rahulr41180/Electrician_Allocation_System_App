
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb+srv://rahulr41180:Rahul12345@cluster0.zkculwy.mongodb.net/electrician-allocation-system-app");

        console.log("Database has been connected successfully");
    } catch(error) {
        console.log(error.message);
    }
}

module.exports = { connectDB };