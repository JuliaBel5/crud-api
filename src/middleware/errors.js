"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
var handleErrors = function (res, code, message) {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: message }));
};
exports.handleErrors = handleErrors;
