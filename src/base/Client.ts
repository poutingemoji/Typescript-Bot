import { stripIndents } from "common-tags";
import { CommandoClient } from "discord.js-commando";
import { config } from "dotenv";
import { writeFile } from "fs";
import { join } from "path";
import { commandGroups, waitingOnResponse } from "../utils/enumHelper";
import { secondsToTimeFormat } from "../utils/Helper";
import {
  Message,
} from "discord.js";
config();


export default class Client extends CommandoClient {
  public init(): void {
    this.loadEventListeners();
    this.loadCommands();
    this.login(process.env.TOKEN);
  }

  private loadEventListeners(): void {
    this.dispatcher.addInhibitor((msg) => {
      if (!waitingOnResponse.has(msg.author.id)) return;
      return {
        reason: "yes",
        response: msg.reply(
          "Please respond to the previous command before executing another."
        ) as Promise<Message>,
      };
    });

    this.on("error", console.error);
    this.once("ready", () => {
      console.log(
        stripIndents(`
        Logged in as ${this.user.tag}! (${this.user.id})
        Guilds: ${this.guilds.cache.size}
        Users: ${this.users.cache.size}
      `)
      );
      this.user.setActivity(`${this.commandPrefix}help`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/pokimane",
      });
    });
    /*
    this.on("message", (msg) => {
    });
    */
  }

  private loadCommands(): void {
    this.registry
      .registerDefaultTypes()
      .registerGroups(Object.entries(commandGroups))
      .registerDefaultGroups()
      .registerDefaultCommands({
        unknownCommand: false,
        help: false,
      })
      .registerCommandsIn({
        filter: /^([^.].*)\.(js|ts)$/,
        dirname: join(__dirname, "../commands"),
      });

    const commandInfos = {};
    this.registry.groups
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
              secondsToTimeFormat(
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
