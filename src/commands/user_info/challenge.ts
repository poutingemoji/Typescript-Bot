import Command from "../../base/Command";
import { characters } from "genshin-impact-api";
export default class ChallengeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "challenge",
      group: "user_info",
      memberName: "challenge",
      description: "Start your adventure.",
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
    const character = characters("kaeya");
    console.log(character);
    msg.say(
      this.buildEmbed({
        title: character.name,
        thumbnail: {
          url:
            "https://static.wikia.nocookie.net/gensin-impact/images/4/47/Character_Traveler_%28Male%29_Portrait.png/revision/latest?cb=20200915142015",
        },
      })
    );
    return;
    const response = await this.confirmation(
      msg,
      `you are being challenged by ${msg.author}!`,
      player
    );
    msg.say(response);
  }
}
