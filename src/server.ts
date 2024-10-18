import http from "http";
import { config } from "dotenv";
import { parse } from "url";
import { requestListener } from "./routes";

config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
