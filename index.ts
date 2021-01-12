import Client from "./Base/Client"
new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).start();