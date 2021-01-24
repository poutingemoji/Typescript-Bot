import Command from "../../base/Command";
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
    const player = await this.getPlayer(msg.author);
    if (!player) return;
    this.buildEmbeds(
        msg,
        player.inventory.toObject(),
        function(item, i) {
          console.log(item, i)
          return "yes"
        },
        {
          color: "#c362cb",
          title: "Inventory",
        },
      )
  }
}
