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
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { httpMethod, body } = event;
    if (httpMethod !== "PUT") {
        return {
            statusCode: 501,
            body: JSON.stringify({ message: "Not Implemented" }),
            headers: { "content-type": "application/json" },
        };
    }
    const { ENDPOINT_PUT, NOTION_TOKEN, DATABASE_ID } = process.env;
    const notion = new client_1.Client({
        auth: NOTION_TOKEN,
    });
    if (!ENDPOINT_PUT || !DATABASE_ID || !NOTION_TOKEN) {
        return {
            statusCode: 500,
            body: "Couldn't get environment variables",
        };
    }
    if (!body) {
        return {
            statusCode: 400,
            body: "Request body can not be empty",
        };
    }
    const { name, cost, currency, category } = JSON.parse(body);
    console.log("BODY: ", body);
    const result = yield notion.pages.create({
        parent: {
            database_id: DATABASE_ID,
        },
        properties: {
            Name: {
                type: "title",
                title: [
                    {
                        text: {
                            content: name,
                        },
                    },
                ],
            },
            Cost: {
                type: "number",
                number: cost,
            },
            Currency: {
                type: "select",
                select: {
                    name: currency,
                },
            },
            Category: {
                type: "select",
                select: {
                    name: category,
                },
            },
        },
    });
    console.log("BODY: ", body);
    if (result) {
        return {
            statusCode: 200,
            headers: constants_1.HEADERS,
            body: JSON.stringify(result),
            response: "Database was successfully updated",
        };
    }
    return {
        statusCode: 400,
        headers: constants_1.HEADERS,
        body: "Couldn't update database",
    };
});
exports.handler = handler;
