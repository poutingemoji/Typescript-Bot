import Command from "../../base/Command";
import { PlayerModel } from "../../database/players/model";
export default class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      group: "user_info",
      memberName: "purge",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
      args: [
        {
          key: "numOfMessages",
          prompt: ``,
          type: "integer",
          default: 5,
        },
      ],
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg, {numOfMessages}) {
    msg.channel.messages
      .fetch({ limit: numOfMessages })
      .then((msgs) => msg.channel.bulkDelete(msgs))
      .catch(console.error);
  }
}
