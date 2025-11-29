const express = require("express");
const router = require("./router.config");
const { deletFile } = require("../utilites/helper");
const cors = require("cors")
const { default: helmet } = require("helmet");
const rateLimit = require("express-rate-limit")
const app = express();

require("./mongodb.config");

app.use(cors({
    // origin: "localhost:5173"
}))
app.use(helmet())
app.use(rateLimit({
    windowMs:60000,
    limit:30
}))

require("./mongodb.config");
app.use(express.json({
    limit:"10mb"
}));

app.use("/api/test",router);


app.use((req,res,next) => {
    next({
        message: "Resource not found",
        code: 404,
        status: "RESOURCE_NOT_FOUND"
    })
});

app.use((error,req,res,next) => {
    let code = error.statusCode || 500;
    let detail = error.detail || null;
    let message = error.message || "Internal Server Error....";
    let status = error.status || "INTERNAL_SERVER_ERROR";


    if(req.file){
        deletFile(req.file.path)
    }

    if(error.name === "MongoServerError") {
        if(+error.code === 11000) {
            code = 400;
            message = "validation Failed",
            detail = {}
            Object.keys(error.keyPattern).forEach((key) => {
                detail[key] = `${key} should be unique value`
            })
        }
    }

    res.status(code).json({
        error:detail,
        message:message,
        status:status,
        options:null
    });
});

module.exports = app;
