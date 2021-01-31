import Command from "../../base/Command";
import { PlayerModel } from "../../database/players/model";
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
    const player = await PlayerModel.findOne({
      discordId: msg.author.id,
    });
    if (!player) return this.noPlayerMessage(msg, msg.author);
    console.log(player)
    player.addExp(600)
  }
}
