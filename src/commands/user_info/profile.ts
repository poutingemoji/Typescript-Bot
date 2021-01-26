import Command from "../../base/Command";
import { stripIndents } from "common-tags";
import {numberWithCommas} from "../../utils/Helper"
export default class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      group: "user_info",
      memberName: "profile",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) {
    const player = await this.getPlayer(msg.author, msg);
    if (!player) return;
    return msg.say(
      this.buildEmbed(
        {
          color: "#c362cb",
          title: "Profile",
          description: stripIndents(`
             ${this.emoji("a_exp")} AR ${player.ar.cur} (${player.exp.cur}/${player.exp.max} EXP)
             ${numberWithCommas(player.mora)} Mora ${this.emoji("mora")}
             ${numberWithCommas(player.primogem)} Primogems ${this.emoji(
            "primogem"
          )}
          `),
          thumbnail: { url: msg.author.displayAvatarURL() },
        },
        { author: msg.author }
      )
    );
  }
}
