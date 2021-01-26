import Client from "./base/Client"
import { config } from "dotenv";
config();
new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).init();