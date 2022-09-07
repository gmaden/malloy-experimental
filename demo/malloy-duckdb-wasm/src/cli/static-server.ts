import express, { Express, Request, Response } from "express";

const server: Express = express();
const port = process.env.PORT || 4321;

console.log(`Starting server listening on port: ${port}`);

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

server.use(express.static("docs"));
