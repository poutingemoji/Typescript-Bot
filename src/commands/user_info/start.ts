import Command from "../../base/Command";
import { stripIndents } from "common-tags";
import { MessageAttachment } from "discord.js";
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
    const player = await this.getPlayer(msg.author);
    if (player) {
      const res = await this.confirmation(
        msg,
        "Are you sure you want to start over?"
      );
      if (!res) return;
    }
    console.log(player);
    const gender = await this.awaitResponse(
      await msg.reply("https://j.gifs.com/3QkQ3n.gif"),
      "REACTION",
      {
        author: msg.author,
        chooseFrom: ["♀️", "♂️"],
      }
    );
    if (!gender) return;
    await this.replacePlayer(msg.author.id, { gender });
    await this.addValueToPlayer(player, "mora", 50000);
    await this.addValueToPlayer(player, "primogem", 1000);
    return msg.reply(
      stripIndents(`
      Congratulations, you have begun your adventure with ${msg.client.user}! 🥳
      As a bonus, 1,000 ${this.emoji("primogem")} and 50,000 ${this.emoji(
        "mora"
      )} has been deposited into your adventurer's profile!`)
    );
  }
}
