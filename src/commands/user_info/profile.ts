import Command from "../../base/Command";
import { stripIndents } from "common-tags";
import { numberWithCommas } from "../../utils/Helper";
import { PlayerModel } from "../../database/players/model";
export default class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      group: "user_info",
      memberName: "profile",
      description: "Start your adventure.",
      args: [
        {
          key: "user",
          prompt: `Who do you want to challenge?`,
          type: "user",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg, { user }) {
    if (!user) user = msg.author;
    const player = await PlayerModel.findOne({
      discordId: msg.author.id,
    }).lean();
    if (!player) return this.noPlayerMessage(msg, user);

    return msg.say(
      this.buildEmbed({
        title: "Profile",
        description: stripIndents(`
             ${this.emoji("a_exp")} AR ${player.ar.cur} (${player.exp.cur}/${
          player.exp.max
        } EXP)
             ${numberWithCommas(player.mora)} Mora ${this.emoji("mora")}
             ${numberWithCommas(player.primogems)} Primogems ${this.emoji(
          "primogems"
        )}
          `),
        thumbnail: { url: user.displayAvatarURL() },
        user,
      })
    );
  }
}
