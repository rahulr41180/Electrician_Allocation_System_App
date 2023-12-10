
const express = require("express");

const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const rawSiteRouter = require("./routers/rawSiteDataRouter.js");
const electricianRouter = require("./routers/electricianDataRouter.js");

app.use("/api/v1/raw-site", rawSiteRouter);
app.use("/api/v1/electrician", electricianRouter);

const PORT = 8080;

app.listen(PORT, async () => {
    try {
        await connectDB();

        console.log("server has been connected successfully and listening on 8080 PORT");
    } catch(error) {
        console.log(error.message);
    }
})