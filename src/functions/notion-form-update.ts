import { Handler } from "@netlify/functions";
import { Client } from "@notionhq/client";
import { HEADERS } from "../constants";

const handler: Handler = async (event) => {
  const { ENDPOINT_PUT, NOTION_TOKEN, DATABASE_ID } = process.env;
  const { httpMethod, body } = event;

  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  if (!ENDPOINT_PUT || !DATABASE_ID || !NOTION_TOKEN) {
    return {
      statusCode: 500,
      body: "Couldn't get environment variables",
    };
  }

  // --- Preflight handler is not mandatory
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: "This was a preflight call!",
    };
  }
  // ---

  if (httpMethod !== "PUT") {
    return {
      statusCode: 501,
      body: JSON.stringify({ message: "Not Implemented" }),
      headers: { "content-type": "application/json" },
    };
  }

  if (!body) {
    return {
      statusCode: 400,
      body: "Request body can not be empty",
    };
  }

  const { name, cost, currency, category } = JSON.parse(body);

  // --- Change the schema to your own
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
  // ---

  if (result) {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(result),
      response: "Database was successfully updated",
    };
  }

  return {
    statusCode: 400,
    headers: HEADERS,
    body: "Couldn't update database",
  };
};

export { handler };
