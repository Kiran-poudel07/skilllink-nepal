const http = require("http");
require("dotenv").config()
const app = require("./src/config/express.config")
const { initSocket } = require("./src/config/socket");
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 9005;
const host = "127.0.0.1";

initSocket(httpServer);
httpServer.listen(PORT,host ,(err) => {
    if (!err) {
        console.log("server is running on port: ", PORT);
        console.log("press CTRL+C to terminate server...");
        console.info(`URL:http://${host}:${PORT}`);
    }

});

