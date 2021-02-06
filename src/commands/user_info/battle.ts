import Command from "../../base/Command";
import { fillArray } from "../../utils/Helper";
import { Enemy } from "../../database/entities/classes";
export default class ChallengeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "battle",
      group: "user_info",
      memberName: "battle",
      description: "Battle mobs.",
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

  async run(msg) {
    const waves = [
      { hilichurl: 2, hilichurlGuard: 2 },
      { hilichurl: 2, hilichurlGuard: 2 },
    ];
    for (let i = 0; i < waves.length; i++) {

      const enemiesInWave = [];
      const newObj = Object.entries(waves).reduce((acc, [key, val]) => {
        console.log(acc, key, val)
        return newObj;
      }, [])

      console.log(enemiesInWave);
    }
  }
}
