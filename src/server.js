"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
var http_1 = require("http");
var routes_1 = require("./routes/routes");
var dotenv = require("dotenv");
dotenv.config();
var PORT = process.env.PORT || 4000;
exports.server = (0, http_1.createServer)(routes_1.requestListener);
exports.server.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
