"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExistError = void 0;
class UserAlreadyExistError extends Error {
    constructor(identifier) {
        super(`User "${identifier}" already exists!`);
    }
}
exports.UserAlreadyExistError = UserAlreadyExistError;
