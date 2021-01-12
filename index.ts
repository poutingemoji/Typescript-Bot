import Client from "./Base/Client"
export const client = new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).start();