"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* example using https://github.com/dougmoscrop/serverless-http */
const serverless_http_1 = __importDefault(require("serverless-http"));
const index_1 = __importDefault(require("../index"));
// We need to define our function name for express routes to set the correct base path
const functionName = "notion-form";
// Initialize express app
const app = (0, index_1.default)(functionName);
// Export lambda handler
exports.handler = (0, serverless_http_1.default)(app);
