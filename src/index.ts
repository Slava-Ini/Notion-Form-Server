import express, { application, Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "@notionhq/client";
import { Request, Response } from "express";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import bodyParser from "body-parser";

export default function expressApp(functionName: string): Express {
  dotenv.config();
  const app = express();
  const router = express.Router();

  const { DATABASE_ID, NOTION_TOKEN, NODE_ENV } = process.env;

  // Set router base path for local dev
  // const routerBasePath =
  //   NODE_ENV === "dev"
  //     ? `/${functionName}`
  //     : `/.netlify/functions/${functionName}/`;

  if (!DATABASE_ID || !NOTION_TOKEN) {
    throw Error("Must define DATABASE_ID and NOTION_TOKEN in env");
  }

  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  function validateResponse(
    response: PageObjectResponse | Partial<PageObjectResponse>
  ): response is PageObjectResponse {
    return Boolean(response?.properties);
  }

  // app.use(cors({ origin: "*", credentials: true }));
  // app.use(bodyParser.json());

  // const port = 8000;

  router.get("/", async (_: Request, res: Response) => {
    const { results } = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    console.log("RES:", results);

    if (validateResponse(results[0])) {
      return res.send(results[0].properties);
    }

    res.status(400).send("Couldn't find any fields on provided database");
  });

  router.put("/update", async (req: Request, res: Response) => {
    const { name, cost, currency, category } = req.body;

    const result = await notion.pages.create({
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
  });

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
  router.use(cors({ origin: "*", credentials: true }));
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));
  return app;
}
