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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@notionhq/client");
const body_parser_1 = __importDefault(require("body-parser"));
function expressApp(functionName) {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const router = express_1.default.Router();
    const { DATABASE_ID, NOTION_TOKEN, NODE_ENV } = process.env;
    // Set router base path for local dev
    // const routerBasePath =
    //   NODE_ENV === "dev"
    //     ? `/${functionName}`
    //     : `/.netlify/functions/${functionName}/`;
    if (!DATABASE_ID || !NOTION_TOKEN) {
        throw Error("Must define DATABASE_ID and NOTION_TOKEN in env");
    }
    const notion = new client_1.Client({
        auth: NOTION_TOKEN,
    });
    function validateResponse(response) {
        return Boolean(response === null || response === void 0 ? void 0 : response.properties);
    }
    // app.use(cors({ origin: "*", credentials: true }));
    // app.use(bodyParser.json());
    // const port = 8000;
    router.get("/", (_, res) => __awaiter(this, void 0, void 0, function* () {
        const { results } = yield notion.databases.query({
            database_id: DATABASE_ID,
        });
        console.log("RES:", results);
        if (validateResponse(results[0])) {
            return res.send(results[0].properties);
        }
        res.status(400).send("Couldn't find any fields on provided database");
    }));
    router.put("/update", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { name, cost, currency, category } = req.body;
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
        if (result) {
            return res.send(result);
        }
        res.status(400).send("Couldn't update");
    }));
    // app.listen(port, () => {
    //   console.log(`App listening on port ${port}`);
    // });
    // Setup routes
    app.use("/.netlify/functions/notion-form", router);
    // app.use("", router);
    // const whitelist = ["http://localhost:3000", "http://developer2.com"];
    // const corsOptions = {
    //   origin: (origin: any, callback: any) => {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error());
    //     }
    //   },
    // };
    // Apply express middlewares
    router.use((0, cors_1.default)({ origin: "*", credentials: true }));
    router.use(body_parser_1.default.json());
    router.use(body_parser_1.default.urlencoded({ extended: true }));
    return app;
}
exports.default = expressApp;
