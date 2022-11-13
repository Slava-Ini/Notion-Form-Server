import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Handler } from "@netlify/functions";
import { HEADERS } from "../constants";

function validateResponse(
  response: PageObjectResponse | Partial<PageObjectResponse>
): response is PageObjectResponse {
  return Boolean(response?.properties);
}

const handler: Handler = async ({ httpMethod }) => {
  // --- Configure your environment variables on netlify
  const { ENDPOINT_GET, NOTION_TOKEN, DATABASE_ID } = process.env;
  // ---

  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  if (!ENDPOINT_GET || !DATABASE_ID || !NOTION_TOKEN) {
    return {
      statusCode: 500,
      body: "Couldn't get environment variables",
    };
  }

  const { results } = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  if (validateResponse(results[0])) {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(results[0].properties),
    };
  }

  // --- Preflight is not mandatory
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: "This was a preflight call!",
    };
  }
  // ---

  return {
    statusCode: 400,
    headers: HEADERS,
    body: "Couldn't find any fields on provided database",
  };
};

export { handler };
