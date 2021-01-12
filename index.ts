import Client from "./Base/Client"
console.log(process.env.TESTPREFIX)
console.log(process.env.MONGODB_URI);
new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).start();