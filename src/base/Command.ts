import { Parser } from "expr-eval";
import Database from "../database/Database";
import { User } from "discord.js";
import { CommandoMessage } from "discord.js-commando";
import { expFormulas } from "../utils/enumHelper";
export default class Command extends Database {
  constructor(client, info) {
    super(client, info);
  }

  protected async getPlayer(user: User, msg?: CommandoMessage) {
    const player = await this.findPlayer(user.id);
    if (!player) {
      if (msg) {
        msg.reply(
          msg.author.id == user.id
            ? `Please type \`${msg.guild.commandPrefix}start\` to begin.`
            : `${user.username} hasn't started climbing the Tower.`
        );
      }
      return false;
    }
    /*
    player.characters.forEach((value, key) =>
      player.characters.set(key, this.getObjectStats(player, key))
    );
    */
    return Object.assign(player, user);
  }

  protected async addValueToPlayer(player, key: string, value: number) {
    player[key] += value;
    //await this.updateQuestProgress(player, "Earn", key, value);
    return this.updatePlayer(player);
  }

  protected async setValueToPlayer(
    player,
    key: string,
    value: boolean | number | string
  ) {
    player[key] = value;
    return this.updatePlayer(player);
  }

  protected addExpToPlayer(player, expToAdd: number) {
    addExp(player, expToAdd, expFormulas.mediumSlow);
    this.updatePlayer(player);
  }

  /*
  protected getObjectStats(player, value, level = false) {
    if (!["object", "string"].includes(typeof value)) return;
    if (typeof value == "string") value = { id: value };

    const { id } = value;
    const datas = [characters, enemies, items];
    const data = datas.find((x) => x.hasOwnProperty(id));

    if (!data[id]) return;
    if (!data[id].hasOwnProperty("baseStats")) return data[id];

    let obj = Object.assign(
      { constructor: data[id].constructor, stats: {} },
      data[id],
      value
    );

    if (!level) {
      switch (Object.getPrototypeOf(obj.constructor).name) {
        case "Character":
          obj = Object.assign(obj, player.characters.get(id));
          level = obj.level.cur;
          break;
        case "Weapon":
          level = obj.level;
          break;
        case "Enemy":
          level = player.level.cur;
          break;
      }
    }

    Object.keys(obj.baseStats).map((statId) => {
      obj.stats[statId] = Parser.evaluate(
        statFormulas[Object.getPrototypeOf(obj.constructor).name.toLowerCase()],
        {
          n: level,
          x: obj.baseStats[statId],
        }
      );
    });

    if (obj.hasOwnProperty("weapon")) {
      obj.weapon = this.getObjectStats(player, obj.weapon);
      Object.keys(obj.weapon.stats).map((statId) => {
        obj.stats[statId] += obj.weapon.stats[statId];
      });
    }
    return obj;
    //Calculate stats
    //Calculate talent level
  }
*/

  /*
  //PLAYER


  protected addExpToCharacter(player, expToAdd: number, characterId: string) {
    const character = player.characters.get(characterId);
    if (!character) return;
    addExp(character, expToAdd, expFormulas["character"]);
    this.replacePlayer(player);
  }





  //CHARACTER
  protected addCharacter(player, characterId) {
    if (player.characters.get(characterId)) return;
    player.characters.set(characterId, newCharacterObj(characterId));
    this.savePlayer(player);
  }

  //INVENTORY
  protected addItem(player, itemId, amount = 1) {
    const item = this.getObjectStats(
      typeof itemId == "object" ? itemId : newEquipmentObj(itemId)
    );
    console.log("TYPE", item.type);
    if (itemCategories.equipment.includes(item.type)) {
      player.equipment.push({ id: item.id, level: item.level });
    } else {
      player.inventory.get(itemId)
        ? player.inventory.set(itemId, player.inventory.get(itemId) + amount)
        : player.inventory.set(itemId, amount);
    }
    //this.updateQuestProgress(player, "Collect", itemId);
    this.savePlayer(player);
  }

  protected removeItem(player, itemId, amount = 1) {
    if (isNaN(itemId)) itemId--;
    const item = isNaN(itemId)
      ? items[itemId]
      : items[player.equipment[itemId].id];
    if (!item) return;
    if (itemCategories.equipment.includes(item.type)) {
      player.equipment.splice(itemId);
    } else {
      player.inventory.get(itemId) >= 2
        ? player.inventory.set(
            itemId,
            player.inventory.get(itemId) -
              clamp(amount, 0, player.inventory.get(itemId))
          )
        : player.inventory.delete(itemId);
    }
    this.savePlayer(player);
  }

  //ITEMS

  //QUESTS
  protected findQuestType(player, type, id) {
    for (let i = 0; i < player.quests.story.length; i++) {
      if (player.quests.story[i].type == type) {
        if (id && player.quests.story[i].questId == id) {
          return player.quests.story[i];
        } else if (!id) {
          return player.quests.story[i];
        }
      }
    }
    return false;
  }

  protected async updateQuestProgress(player, type, id, value = 1) {
    const quest = this.findQuestType(player, type, id);
    console.log(quest, id);
    if (!quest || quest.progress == quest.goal) return;
    console.log(quest, id);
    if (isNaN(value)) {
      quest.progress = value;
    } else {
      quest.progress += Math.min(value, quest.goal - quest.progress);
      console.log(quest.progress);
    }
  }

  protected addQuests(player) {
    this.savePlayer(player, {
      "quests.story":
        arcs[player.progression.story.arc].chapters[
          player.progression.story.chapter
        ].quests,
    });
  }

  //GETTERS
  protected getAdventureRankRange(player) {
    let previousAR = 1;
    for (let AR in adventureRankRanges) {
      console.log(AR);
      if (isBetween(player.adventureRank.cur, previousAR, AR))
        return adventureRankRanges[AR];
      previousAR = AR + 1;
    }
  }

  */
}

function addExp(obj, expToAdd: number, expFormula: string) {
  obj.exp.cur += expToAdd;
  while (obj.exp.cur >= obj.exp.max && obj.level.cur < obj.level.max) {
    obj.level.cur++;
    obj.exp.cur -= obj.exp.max;
    obj.exp.max = Parser.evaluate(expFormula, {
      n: obj.level.cur + 1,
    });
  }
}
