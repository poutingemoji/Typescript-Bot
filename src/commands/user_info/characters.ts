import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { convertObjectToArray } from "../../utils/Helper";
import { stripIndents } from "common-tags";
import { PlayerModel } from "../../database/players/model";
export default class CharactersCommand extends Command {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: ["chars"],
      group: "user_info",
      memberName: "characters",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) {
    const player = await PlayerModel.findOne({
      discordId: msg.author.id,
    }).lean();
    if (!player) return this.noPlayerMessage(msg, msg.author);

    this.buildEmbeds(
      msg,
      convertObjectToArray(player.characters),
      (item) => {
        item = this.combineData(item);
        return stripIndents(`
          ${this.emoji(item.emoji)} ${item.name}
          ${this.emoji(item.weapon.emoji)} ${item.weapon.name} | LVL ${
          item.lvl.cur
        } (${item.weapon.exp.cur}/${item.weapon.exp.max} EXP)
        `);
      },
      { title: "Characters" }
    );
  }
}
