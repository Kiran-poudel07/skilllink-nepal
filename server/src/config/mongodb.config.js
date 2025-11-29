const mongoose = require("mongoose");
const { mongoDBConfig} = require("./config");

(async() => {
    try{
        await mongoose.connect(mongoDBConfig.url, {
            dbName: mongoDBConfig.dbName,
            autoCreate: true,
            autoIndex: true
        })
        console.log("*****mongodb server connection sucessfull**********")
    }catch(exception){
        console.log("*********Error establishing DB connection*******");
        console.log(exception);
        process.exit(1)
    }
})();