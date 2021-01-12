import Client from "./Base/Client"
console.log(process.env.PREFIX)
console.log(process.env.MONGODB_URI);
new Client({
  commandPrefix: process.env.COMMAND_PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).start();