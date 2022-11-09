"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.HEADERS = void 0;
exports.HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
};
var Method;
(function (Method) {
    Method["Get"] = "GET";
    Method["Put"] = "PUT";
})(Method = exports.Method || (exports.Method = {}));
