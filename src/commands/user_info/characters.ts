import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { convertToArray } from "../../utils/Helper";
import { stripIndents } from "common-tags";
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
    const player = await this.getPlayer(msg.author, msg);
    if (!player) return;
    this.buildEmbeds(
      msg,
      player.characters,
      (item) => {
        item = this.combineData(item);
        return stripIndents(`
          ${this.emoji(item.emoji)} ${item.name}
          ${this.emoji(item.weapon.emoji)} ${item.weapon.name} | LVL ${item.lvl.cur} (${item.weapon.exp.cur}/${item.weapon.exp.max} EXP)
        `);
      },
      { title: "Characters" }
    );
  }
}
