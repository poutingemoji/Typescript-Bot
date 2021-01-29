import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { convertObjectToString } from "../../utils/Helper";
import { stripIndents } from "common-tags";
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
    const player = await this.getPlayer(msg.author, msg);
    if (!player) return;
    this.buildEmbeds(
      msg,
      player.inventory,
      (item) => {
        item = this.combineData(item);
        return `${this.emoji(item.emoji)} ${item.name} ${
          item.hasOwnProperty("value") ? ` | QTY: ${item.value}` : ""
        }`;
      },
      { indexing: "LOCAL", title: "Inventory" },
    );
  }
}
