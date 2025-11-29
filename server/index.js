const http = require("http");
require("dotenv").config();
const app = require("./src/config/express.config");
const { initSocket } = require("./src/config/socket");

const PORT = process.env.PORT || 9005;

const HOST = "0.0.0.0";

const httpServer = http.createServer(app);

initSocket(httpServer);


httpServer.listen(PORT, HOST, (err) => {
    if (!err) {
        console.log("***** Server is running *****");
        console.log("Port:", PORT);
        console.log("Press CTRL+C to terminate server...");
        console.info(`URL: http://${HOST}:${PORT}`);
    } else {
        console.error("Server failed to start:", err);
    }
});
