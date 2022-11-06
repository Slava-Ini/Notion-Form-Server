/* example using https://github.com/dougmoscrop/serverless-http */
import serverless from "serverless-http";
import expressApp from "../index";

// We need to define our function name for express routes to set the correct base path
const functionName = "notion-form";

// Initialize express app
const app = expressApp(functionName);

// Export lambda handler
exports.handler = serverless(app);
