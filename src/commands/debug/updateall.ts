import Command from "../../base/Command";
import { PlayerModel } from "../../database/players/model";
export default class UpdateAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: "updateall",
      group: "user_info",
      memberName: "updateall",
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
    await PlayerModel.updateMany(
      {},
      { $unset: {} },
      { upsert: true },
      (err, res) => {
        console.log(res);
      }
    );
    return msg.react("✅");
  }
}
