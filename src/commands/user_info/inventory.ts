import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { stripIndents } from "common-tags";
import { PlayerModel } from "../../database/players/model";
import { Weapon } from "../../database/weapons/classes";
import { Item } from "../../database/items/classes";
export default class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "user_info",
      memberName: "inventory",
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
      player.inventory,
      (item) => {
        if (item.hasOwnProperty("lvl")) {
          item = new Weapon(item);
          return `${this.emoji(item.emoji)} ${item.name} | Lvl. ${item.lvl.cur} (Exp ${item.exp.cur}/${item.exp.max})`;
        } else {
          item = new Item(item);
          return `${this.emoji(item.emoji)} ${item.name}`;
        }
      },
      { indexing: "LOCAL", title: "Inventory" }
    );
  }
}
