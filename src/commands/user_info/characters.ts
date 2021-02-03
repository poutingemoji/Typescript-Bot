import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { convertObjectToArray } from "../../utils/Helper";
import { stripIndents } from "common-tags";
import { PlayerModel } from "../../database/players/model";
import { Character } from "../../database/entities/classes";
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
      (char) => {
        char = new Character(char);
        const weapon = char.weapon;
        //prettier-ignore
        return stripIndents(`
          ${char.name} Lvl. ${char.lvl.cur}/${char.lvl.max} (Exp ${char.exp.cur}/${char.exp.max})
          ${this.emoji(weapon.emoji)} ${weapon.name} | Lvl. ${char.lvl.cur} (Exp ${weapon.exp.cur}/${weapon.exp.max})
        `);
      },
      { title: "Characters" }
    );
  }
}
