import { Handler } from "@netlify/functions";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { HEADERS } from "../constants";
// TODO: remove node fetch from npm
// import fetch from "node-fetch";

function validateResponse(
  response: PageObjectResponse | Partial<PageObjectResponse>
): response is PageObjectResponse {
  return Boolean(response?.properties);
}

const handler: Handler = async () => {
  // const { path, httpMethod, headers, queryStringParameters, body } = event;

  const { ENDPOINT_GET, NOTION_TOKEN, DATABASE_ID } = process.env;

  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  if (!ENDPOINT_GET || !DATABASE_ID || !NOTION_TOKEN) {
    return {
      statusCode: 500,
      response: "Couldn't get environment variables",
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

  return {
    statusCode: 400,
    headers: HEADERS,
    response: "Couldn't find any fields on provided database",
  };
};

export { handler };
