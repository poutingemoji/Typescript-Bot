import Client from "./base/Client";
console.log(process.env.PREFIX);
new Client({
  commandPrefix: process.env.PREFIX,
  owner: "257641125135908866",
  shards: "auto",
}).init();
