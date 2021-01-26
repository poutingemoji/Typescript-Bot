import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
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
        console.log(item);
        return `${i+1}) ${item.hasOwnProperty("emoji") ? item.emoji : ""} [${
          item.name
        }](${links.repository})`;
      },
      { title: "Inventory" }
    );
  }
}
