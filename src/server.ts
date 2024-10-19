import http from "http";
import { config } from "dotenv";
import { requestListener } from "./routes/routes";

config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
