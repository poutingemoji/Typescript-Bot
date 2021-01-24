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
        console.log(item, i)
        return "YES"
      },
      { title: "Inventory" }
    );
  }
}
//`${i}) [${item.id}](${links.repository}) `