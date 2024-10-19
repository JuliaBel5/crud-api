"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUserId = void 0;
var uuid_1 = require("uuid");
var isValidUserId = function (id) { return (0, uuid_1.validate)(id); };
exports.isValidUserId = isValidUserId;
