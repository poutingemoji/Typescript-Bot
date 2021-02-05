import Command from "../../base/Command";
export default class ChallengeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "challenge",
      group: "user_info",
      memberName: "challenge",
      description: "Challenge someone.",
      /*
      args: [
        {
          key: "player",
          prompt: `Who do you want to challenge?`,
          type: "user",
        },
      ],
      */
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg, { player }) {
    const response = await this.confirm(
      msg,
      `you are being challenged by ${msg.author}!`,
      player
    );
    return msg.say(response);
  }
}
