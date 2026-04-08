"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserName = void 0;
const formatUserName = (user) => {
    return `${user.name} (${user.email})`;
};
exports.formatUserName = formatUserName;
