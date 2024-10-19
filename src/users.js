"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
var uuid_1 = require("uuid");
var users = [];
var getAllUsers = function () { return users; };
exports.getAllUsers = getAllUsers;
var getUserById = function (id) { return users.find(function (user) { return user.id === id; }); };
exports.getUserById = getUserById;
var createUser = function (username, age, hobbies) {
    var newUser = { id: (0, uuid_1.v4)(), username: username, age: age, hobbies: hobbies };
    users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
var updateUser = function (id, username, age, hobbies) {
    var userIndex = users.findIndex(function (user) { return user.id === id; });
    if (userIndex === -1)
        return null;
    users[userIndex] = { id: id, username: username, age: age, hobbies: hobbies };
    return users[userIndex];
};
exports.updateUser = updateUser;
var deleteUser = function (id) {
    var userIndex = users.findIndex(function (user) { return user.id === id; });
    if (userIndex === -1)
        return false;
    users.splice(userIndex, 1);
    return true;
};
exports.deleteUser = deleteUser;
