# Notion-Form-Server

An example of simple api that can get and update notion database using netlify functions.

## Note

- Default notion schema from `notion-form-update.ts` should be adapted to your own notion database to work properly.
- Preflight handling is excessive and was left in the code as an example.
- CORS headers in lambda files are also excessive as soon as `nerlify.toml` contains headers configuration.
- Environment variables should be set on your netlify project in order to work, as an option you can configure them localy in `.env` file using `dotenv` npm package.

## Commands

- `npm run build` - compile typescript code to js in `build` folder.
- `npm run build:lambda` - build your lambda functions to `lambda` directory based on `build` folder code.
- `npm run dev` - compile and run your functions using `nodemon` and `netlify-cli` (_WARNING_: `netlify-cli` is not included in dev dependencies and is recommended to be installed globaly), watch file changes. 
