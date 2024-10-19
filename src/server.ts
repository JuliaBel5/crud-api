import { createServer } from "http";
import { requestListener } from "./routes/routes";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

export const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
