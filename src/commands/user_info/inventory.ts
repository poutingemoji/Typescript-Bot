import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { stripIndents } from "common-tags";
import { PlayerModel } from "../../database/players/model";
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
        item = this.combineData(item);
        console.log(item);

        return `${this.emoji(item.emoji)} ${item.name} ${
          item.hasOwnProperty("value") ? ` | QTY: ${item.value}` : ""
        }`;
      },
      { indexing: "LOCAL", title: "Inventory" }
    );
  }
}
