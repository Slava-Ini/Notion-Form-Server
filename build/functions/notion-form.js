"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_1 = require("@notionhq/client");
const constants_1 = require("../constants");
// TODO: remove node fetch from npm
// import fetch from "node-fetch";
function validateResponse(response) {
    return Boolean(response === null || response === void 0 ? void 0 : response.properties);
}
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    // const { path, httpMethod, headers, queryStringParameters, body } = event;
    const { ENDPOINT_GET, NOTION_TOKEN, DATABASE_ID } = process.env;
    const notion = new client_1.Client({
        auth: NOTION_TOKEN,
    });
    if (!ENDPOINT_GET || !DATABASE_ID || !NOTION_TOKEN) {
        return {
            statusCode: 500,
            response: "Couldn't get environment variables",
        };
    }
    const { results } = yield notion.databases.query({
        database_id: DATABASE_ID,
    });
    if (validateResponse(results[0])) {
        return {
            statusCode: 200,
            headers: constants_1.HEADERS,
            body: JSON.stringify(results[0].properties),
        };
    }
    return {
        statusCode: 400,
        headers: constants_1.HEADERS,
        response: "Couldn't find any fields on provided database",
    };
});
exports.handler = handler;
