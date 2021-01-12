import Client from "./Base/Client"
console.log(process.env.PREFIX)
new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).start();