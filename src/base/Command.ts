import { User } from "discord.js";
import { CommandoMessage } from "discord.js-commando";
import { Parser } from "expr-eval";
import artifacts from "../data/artifacts";
import items from "../data/items";
import weapons from "../data/weapons";
import characters from "../data/characters";
import Database from "../database/Database";
import {PlayerModel} from "../database/players/model";
import { expFormulas } from "../utils/enumHelper";
import { Weapon } from "../utils/game/Weapon";
import { convertToArray } from "../utils/Helper";
import { Character } from "../utils/game/Entity";
import {IPlayerDocument} from "../database/players/types"

export default class Command extends Database {
  constructor(client, info) {
    super(client, info);
  }

  protected async getPlayer(user: User, msg?: CommandoMessage): Promise<IPlayerDocument> {
    const player = await PlayerModel.findOne({ discordId: user.id });
    if (!player) {
      if (msg) {
        msg.reply(
          msg.author.id == user.id
            ? `Please type \`${msg.guild.commandPrefix}start\` to begin.`
            : `${user.username} hasn't began their adventure.`
        );
      }
    }
    return player as IPlayerDocument;
  }

  protected addExpToPlayer(player, expToAdd: number) {
    addExp(player, expToAdd, expFormulas.mediumSlow);
    PlayerModel.updateOne({ discordId: player.discordId }, player);
  }

  protected combineData(value, lvl = { cur: 1 }) {
    const datas = Object.assign({}, characters, items, weapons, artifacts);
    const data = datas[value.id];
    if (!data) return value;
    //if (!data.hasOwnProperty("baseStats")) return data;
    const obj = Object.assign({ constructor: data.constructor }, data, value, {
      lvl: value.hasOwnProperty("lvl") ? value.lvl : lvl,
    });
    if (obj.constructor == Weapon) {
    }

    if (obj.constructor == Character) {
      obj.weapon = this.combineData(obj.weapon);
    }
    /*
       Object.keys(obj.baseStats).map((statId) => {
      obj.stats[statId] = Parser.evaluate(
        statFormulas[Object.getPrototypeOf(obj.constructor).name.toLowerCase()],
        {
          lvl: obj.lvl,
          x: obj.baseStats[statId],
        }
      );
    });

    if (obj.hasOwnProperty("weapon")) {
      obj.weapon = this.combineData(player, obj.weapon);
      Object.keys(obj.weapon.stats).map((statId) => {
        obj.stats[statId] += obj.weapon.stats[statId];
      });
    }
    */
    return obj;
    //Calculate stats
    //Calculate talent lvl
  }

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
      player.equipment.push({ id: item.id, lvl: item.lvl });
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
  while (obj.exp.cur >= obj.exp.max && obj.lvl.cur < obj.lvl.max) {
    obj.lvl.cur++;
    obj.exp.cur -= obj.exp.max;
    obj.exp.max = Parser.evaluate(expFormula, {
      lvl: obj.lvl.cur + 1,
    });
  }
}
