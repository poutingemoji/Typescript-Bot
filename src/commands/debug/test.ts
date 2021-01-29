import Command from "../../base/Command";
import { links } from "../../utils/enumHelper";
import { convertToArray } from "../../utils/Helper";
import { stripIndents } from "common-tags";
export default class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "user_info",
      memberName: "test",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg) {
    const player = await this.getPlayer(msg.author, msg);
    if (!player) return;
    console.log(player.characters)
  }
}
