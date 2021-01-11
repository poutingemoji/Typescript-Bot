import { Command, CommandoClient } from "discord.js-commando";
import { writeFile } from "fs";
import { join } from "path";
import { stripIndents } from "common-tags";
import { config } from "dotenv";
import enumHelper from "../utils/enumHelper";
import Helper from "../utils/Helper";
config();

export default class DiscordBot {
  private client: CommandoClient;
  constructor() {
    this.client = new CommandoClient({
      commandPrefix: process.env.PREFIX,
      //owner: "257641125135908866",
      shards: "auto",
    });
  }

  public start(): void {
    this.loadEventListeners();
    this.loadCommands();
    this.client.login(process.env.TOKEN);
  }

  private loadEventListeners(): void {
    this.client.dispatcher.addInhibitor((msg) => {
      if (!enumHelper.waitingOnResponse.has(msg.author.id)) return;
      return {
        reason: "",
        response: msg.reply(
          "Please respond to the previous command before executing another."
        ),
      };
    });

    this.client.on("error", console.error);
    this.client.once("ready", () => {
      console.log(
        stripIndents(`
        Logged in as ${this.client.user.tag}! (${this.client.user.id})
        Guilds: ${this.client.guilds.cache.size}
        Users: ${this.client.users.cache.size}
      `)
      );
      this.client.user.setActivity(`${this.client.commandPrefix}help`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/pokimane",
      });
    });
    /*
    
    this.client.on("message", (msg) => {
      if (msg.author.id == "257641125135908866") {
        msg.reply("you are dumb");
      }
    });

    */
  }

  private loadCommands(): void {
    this.client.registry
      .registerDefaultTypes()
      .registerGroups(Object.entries(enumHelper.commandGroups))
      .registerDefaultGroups()
      .registerDefaultCommands({
        //unknownCommand: false,
        //help: false,
      })
      .registerCommandsIn({
        filter: /^([^.].*)\.(js|ts)$/,
        dirname: join(__dirname, "commands"),
      });

    const commandInfos = {};
    this.client.registry.groups
      .filter((grp) => grp.commands.some((cmd) => !cmd.hidden))
      .map((grp) => {
        const groupCommandInfos = [];
        grp.commands
          .filter((cmd) => !cmd.hidden)
          .map((cmd) => {
            groupCommandInfos.push([
              `${cmd.name}`,
              `${cmd.description ? cmd.description : ""}${
                cmd.nsfw ? " (NSFW)" : ""
              }`,
              `${cmd.examples ? cmd.examples.join("\n") : ""}`,
              `${cmd.aliases ? cmd.aliases.join("\n") : ""}`,
              Helper.secondsToTimeFormat(
                cmd.throttling ? cmd.throttling.duration : 0,
                ", ",
                false
              ),
            ]);
          });
        commandInfos[grp.name] = groupCommandInfos;
      });

    writeFile(
      `./docs/commandInfos.json`,
      JSON.stringify(commandInfos),
      function () {
        console.log("commandInfos.json Refreshed.");
      }
    );
  }
}
