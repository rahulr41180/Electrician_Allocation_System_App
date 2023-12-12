
const express = require("express");

const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");

dotenv.config();

// App Creating
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routers
const rawSiteRouter = require("./routers/rawSiteDataRouter.js");
const electricianRouter = require("./routers/electricianDataRouter.js");


// API Calling
app.use("/api/v1/raw-site", rawSiteRouter);
app.use("/api/v1/electrician", electricianRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    try {
        await connectDB();

        console.log("server has been connected successfully and listening on 8080 PORT");
    } catch(error) {
        console.log(error.message);
    }
})