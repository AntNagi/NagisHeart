import { createHttpServer } from "./http.js";

const port = Number(process.env.PORT ?? 3000);
const server = createHttpServer();

server.listen(port, "127.0.0.1", () => {
  console.log(`Nagi local server listening on http://127.0.0.1:${port}`);
});
