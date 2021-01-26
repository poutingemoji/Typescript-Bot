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
    /*
     */
    this.buildEmbeds(
      msg,
      player.inventory.toObject(),
      (item, i) => {
        item = this.combineData(item);
        return `${i + 1}) ${item.emoji} [${item.name}](${
          links.repository
        } "${stripIndents(`
          ${item.rarity.emoji} ${item.constructor.name}
          id: ${item.id}
          
          ${item.description}
        `)}")`;
      },
      { title: "Inventory" }
    );
  }
}
