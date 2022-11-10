import { Handler } from "@netlify/functions";
import { Client } from "@notionhq/client";
import { HEADERS } from "../constants";

const handler: Handler = async (event) => {
  const { httpMethod, body } = event;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200, // <-- Must be 200 otherwise pre-flight call fails
      headers: HEADERS,
      body: "This was a preflight call!",
    };
  }

  if (httpMethod !== "PUT") {
    return {
      statusCode: 501,
      body: JSON.stringify({ message: "Not Implemented" }),
      headers: { "content-type": "application/json" },
    };
  }

  const { ENDPOINT_PUT, NOTION_TOKEN, DATABASE_ID } = process.env;

  const notion = new Client({
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
  console.log("BODY: ", body);

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
