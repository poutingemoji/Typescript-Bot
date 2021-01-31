import { stripIndents } from "common-tags";
import Command from "../../base/Command";
import characters from "../../data/characters";
import weapons from "../../data/weapons";
import { PlayerModel } from "../../database/players/model";
import { randomWeightedChoice } from "../../utils/Helper";

const pool = Object.values(Object.assign({}, characters, weapons));
const wishGIFs = {
  [1]: {
    [5]: "https://cdn.discordapp.com/attachments/722720878932262952/804586999356850196/5starwish-single.gif",
    [4]: "https://cdn.discordapp.com/attachments/722720878932262952/804587004011872256/3starwish-single.gif",
    [1]: "https://cdn.discordapp.com/attachments/722720878932262952/804587004011872256/3starwish-single.gif",
  },
  [10]: {
    [5]: "https://cdn.discordapp.com/attachments/722720878932262952/804587004562112532/5starwish-multiple.gif",
    [4]: "https://cdn.discordapp.com/attachments/722720878932262952/804587001462521886/4starwish-multiple.gif",
  },
};

const pitySystem = {
  ["Character"]: {
    [5]: 90,
    [4]: 10,
  },
  ["Weapon"]: {
    [5]: 80,
    [4]: 10,
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
    const player = await PlayerModel.findOne({ discordId: msg.author.id });
    if (!player) return this.noPlayerMessage(msg, msg.author);

    player.primogems -= 160 * numOfWishes;
    let items = [];
    for (let i = 0; i < numOfWishes; i++) {
      let filteredPool = pool;
      for (let rarityId in pitySystem["Character"]) {
        if (player.pity[rarityId] + 1 >= pitySystem["Character"][rarityId]) {
          filteredPool = filteredPool.filter(
            (item) => item.rarity.id == parseInt(rarityId)
          );
          break;
        }
      }
      const item = randomWeightedChoice(
        filteredPool,
        (obj) => obj.rarity.weight
      );
      for (let rarityId in pitySystem["Character"]) {
        player.pity[rarityId] += 1;
        if (rarityId == item.rarity.id) player.pity[rarityId] = 0;
      }
      items.push(item);
    }
    await player.save();
    const highestRarityItem = items
      .map((item) => item.rarity.id)
      .sort((a, b) => a - b)[items.length - 1];
    return msg.reply(
      stripIndents(`
        ${wishGIFs[numOfWishes][highestRarityItem]}
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
