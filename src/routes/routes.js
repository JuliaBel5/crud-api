"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestListener = void 0;
var url_1 = require("url");
var users_1 = require("../users");
var errors_1 = require("../middleware/errors");
var utils_1 = require("../utils");
var requestListener = function (req, res) {
    var _a, _b, _c, _d;
    var method = req.method, url = req.url;
    var parsedUrl = (0, url_1.parse)(url, true);
    var userId = (_a = parsedUrl.pathname) === null || _a === void 0 ? void 0 : _a.split("/").pop();
    try {
        if (parsedUrl.pathname === "/api/users" && method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify((0, users_1.getAllUsers)()));
        }
        else if (method === "GET" &&
            ((_b = parsedUrl.pathname) === null || _b === void 0 ? void 0 : _b.startsWith("/api/users/"))) {
            if (!(0, utils_1.isValidUserId)(userId)) {
                (0, errors_1.handleErrors)(res, 400, "Invalid userId");
                return;
            }
            var user = (0, users_1.getUserById)(userId);
            if (!user) {
                (0, errors_1.handleErrors)(res, 404, "User not found");
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        }
        else if (parsedUrl.pathname === "/api/users" && method === "POST") {
            var body_1 = "";
            req.on("data", function (chunk) {
                body_1 += chunk.toString();
            });
            req.on("end", function () {
                try {
                    var _a = JSON.parse(body_1), username = _a.username, age = _a.age, hobbies = _a.hobbies;
                    if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
                        (0, errors_1.handleErrors)(res, 400, "Invalid user data");
                        return;
                    }
                    var newUser = (0, users_1.createUser)(username, age, hobbies);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(newUser));
                }
                catch (_b) {
                    (0, errors_1.handleErrors)(res, 400, "Invalid JSON");
                }
            });
        }
        else if (method === "PUT" &&
            ((_c = parsedUrl.pathname) === null || _c === void 0 ? void 0 : _c.startsWith("/api/users/"))) {
            if (!(0, utils_1.isValidUserId)(userId)) {
                (0, errors_1.handleErrors)(res, 400, "Invalid userId");
                return;
            }
            var body_2 = "";
            req.on("data", function (chunk) {
                body_2 += chunk.toString();
            });
            req.on("end", function () {
                try {
                    var _a = JSON.parse(body_2), username = _a.username, age = _a.age, hobbies = _a.hobbies;
                    var updatedUser = (0, users_1.updateUser)(userId, username, age, hobbies);
                    if (!updatedUser) {
                        (0, errors_1.handleErrors)(res, 404, "User not found");
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(updatedUser));
                }
                catch (_b) {
                    (0, errors_1.handleErrors)(res, 400, "Invalid JSON");
                }
            });
        }
        else if (method === "DELETE" &&
            ((_d = parsedUrl.pathname) === null || _d === void 0 ? void 0 : _d.startsWith("/api/users/"))) {
            if (!(0, utils_1.isValidUserId)(userId)) {
                (0, errors_1.handleErrors)(res, 400, "Invalid userId");
                return;
            }
            var isDeleted = (0, users_1.deleteUser)(userId);
            if (!isDeleted) {
                (0, errors_1.handleErrors)(res, 404, "User not found");
                return;
            }
            res.writeHead(204);
            res.end();
        }
        else if (parsedUrl.pathname === "/api/error" && method === "GET") {
            throw new Error("This is a forced error for testing purposes.");
        }
        else {
            (0, errors_1.handleErrors)(res, 404, "Not found");
        }
    }
    catch (_e) {
        (0, errors_1.handleErrors)(res, 500, "Internal Server Error");
    }
};
exports.requestListener = requestListener;
