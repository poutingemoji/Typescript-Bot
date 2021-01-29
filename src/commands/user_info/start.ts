import { stripIndents } from "common-tags";
import { Document } from "mongoose";
import Command from "../../base/Command";
import { PlayerModel } from "../../database/players/model";
import { IPlayerDocument } from "../../database/players/types";
import { numberWithCommas } from "../../utils/Helper";
export default class StartCommand extends Command {
  constructor(client) {
    super(client, {
      name: "start",
      group: "user_info",
      memberName: "start",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) {
    let player = await this.getPlayer(msg.author);
    if (player instanceof Document) {
      if (!(await this.confirm(msg, "Are you sure you want to start over?")))
        return;
    }
    const gender = await this.awaitResponse(
      await msg.reply("https://j.gifs.com/3QkQ3n.gif"),
      "REACTION",
      {
        author: msg.author,
        chooseFrom: ["♀️", "♂️"],
      }
    );
    if (!gender) return;
    await PlayerModel.replaceOne(
      { discordId: msg.author.id },
      { discordId: msg.author.id, gender } as IPlayerDocument,
      { upsert: true }
    );
    player = await PlayerModel.findOne({ discordId: msg.author.id });
    return msg.reply(
      stripIndents(`
      Congratulations, you have begun your adventure with ${msg.client.user}! 🥳
      As a bonus, **${numberWithCommas(player.primogem)}** ${this.emoji(
        "primogem"
      )} and **${numberWithCommas(player.mora)}** ${this.emoji(
        "mora"
      )} has been deposited into your adventurer's profile!`)
    );
  }
}
