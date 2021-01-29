import Command from "../../base/Command";
import { randomWeightedChoice } from "../../utils/Helper";
import characters from "../../data/characters";
import weapons from "../../data/weapons";
import { stripIndents } from "common-tags";
import {PlayerModel} from "../../database/players/model";

const pool = Object.values(Object.assign({}, characters, weapons))
const wishGIFs = {
  [1]: {
    [1]: "https://cdn.discordapp.com/attachments/722720878932262952/804587004011872256/3starwish-single.gif",
    [4]: "one wish rarity 4 gif",
    [5]: "https://cdn.discordapp.com/attachments/722720878932262952/804586999356850196/5starwish-single.gif",
  },
  [10]: {
    [4]: "https://cdn.discordapp.com/attachments/722720878932262952/804587001462521886/4starwish-multiple.gif",
    [5]: "https://cdn.discordapp.com/attachments/722720878932262952/804587004562112532/5starwish-multiple.gif",
  },
};
export default class WishCommand extends Command {
  constructor(client) {
    super(client, {
      name: "wish",
      group: "user_info",
      memberName: "wish",
      description: "Start your adventure.",
      args: [
        {
          key: "numOfWishes",
          prompt: `How many wishes do you want to use?`,
          type: "integer",
          oneOf: [1, 10],
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { numOfWishes }) {
    const player = await this.getPlayer(msg.author, msg);
    if (!player) return;
    let items = [];
    for (let i = 0; i < numOfWishes; i++) {
      player.pity4 += 1
      player.pity5 += 1;
      player.primogem -= 160
      console.log(player)
      await PlayerModel.updateOne({ discordId: msg.author.id }, player);
      let filteredPool = pool;
      if (player.pity5 == 89) {
        filteredPool.filter(item => item.rarity.id == 5)
      } else if (player.pity4 == 9) {
        filteredPool.filter((item) => item.rarity.id == 4);
      } 
      items.push(
        randomWeightedChoice(filteredPool, (obj) => obj.rarity.weight)
      );
    }
    return msg.reply(
      stripIndents(`
        ${
          wishGIFs[numOfWishes][
            items.map((item) => item.rarity.id).sort((a, b) => a - b)[
              items.length - 1
            ]
          ]
        }
        ${items
          .map(
            (item) =>
              `${item.rarity.emoji} ${this.emoji(item.emoji)} **${item.name}**`
          )
          .join("\n")}
      `)
    );
  }
}
