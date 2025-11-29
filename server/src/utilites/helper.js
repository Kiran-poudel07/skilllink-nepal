const fs = require('fs');

const deletFile = (filePath) => {
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
        return true
    }else {
        return false;
    }
}


const randomStringGenerate = (len = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let random = "";
    
    for(let i=1; i<= len; i++) {
        const posn = Math.floor(Math.random() * chars.length);
        random += chars[posn]
    }
    return random
}
exports.sendNotification = (userId, message) => {
//   console.log(` Notification sent to User(${userId}): ${message}`);
};

module.exports = {
    deletFile,
    randomStringGenerate
}