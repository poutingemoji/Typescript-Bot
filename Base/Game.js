//BASE
const Parser = require("expr-eval").Parser;
const { stripIndents } = require("common-tags");
const { capitalCase, camelCase, snakeCase } = require("change-case");
const cloneDeep = require("lodash.clonedeep");

//DATA
const { newEquipmentObj } = require("../database/schemas/equipment");
const { newCharacterObj } = require("../database/schemas/character");
const arcs = require("../data/arcs");
const characters = require("../data/characters");
const enemies = require("../data/enemies");
const emojis = require("../data/emojis");
const items = require("../data/items");
const talents = require("../data/talents");
console.log(items)
// UTILS
const Database = require("../database/Database");
const {
  adventureRankRanges,
  expFormulas,
  statFormulas,
  itemCategories,
} = require("../utils/enumHelper");
const { clamp, isBetween, randomWeightedChoice } = require("../utils/Helper");
console.log("ITEM", randomWeightedChoice(Object.values(items)))
module.exports = class Game {
  constructor(client) {
    this.Database = new Database(client, this);
  }

  //EXPERIENCE
  addExpToPlayer(player, expToAdd) {
    addExp(player, expToAdd, expFormulas["player"]);
    this.Database.savePlayer(player);
  }

  addExpToCharacter(player, expToAdd, characterId) {
    const character = player.characters.get(characterId);
    if (!character) return;
    addExp(character, expToAdd, expFormulas["character"]);
    this.Database.savePlayer(player);
  }

  //PLAYER
  async findPlayer(user, msg) {
    const player = await this.Database.loadPlayer(user.id);
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
    player.characters.forEach((value, key) =>
      player.characters.set(key, this.getObjectStats(player, key))
    );
    return Object.assign(player, user);
  }

  async addValueToPlayer(player, key, value) {
    player[key] += value;
    await this.updateQuestProgress(player, "Earn", key, value);
    this.Database.savePlayer(player);
  }

  //CHARACTER
  addCharacter(player, characterId) {
    if (player.characters.get(characterId)) return;
    player.characters.set(characterId, newCharacterObj(characterId));
    this.Database.savePlayer(player);
  }

  //INVENTORY
  addItem(player, itemId, amount = 1) {
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
    this.Database.savePlayer(player);
  }

  removeItem(player, itemId, amount = 1) {
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
    this.Database.savePlayer(player);
  }

  //ITEMS

  //QUESTS
  findQuestType(player, type, id) {
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

  async updateQuestProgress(player, type, id, value = 1) {
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

  addQuests(player) {
    this.Database.savePlayer(player, {
      "quests.story":
        arcs[player.progression.story.arc].chapters[
          player.progression.story.chapter
        ].quests,
    });
  }

  //GETTERS
  getAdventureRankRange(player) {
    let previousAR = 1;
    for (let AR in adventureRankRanges) {
      console.log(AR);
      if (isBetween(player.adventureRank.current, previousAR, AR))
        return adventureRankRanges[AR];
      previousAR = AR + 1;
    }
  }

  getObjectStats(player, value, level) {
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
          level = obj.level.current;
          break;
        case "Weapon":
          level = obj.level;
          break;
        case "Enemy":
          level = player.level.current;
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
};

function addExp(obj, expToAdd, expFormula) {
  obj.exp.current += expToAdd;
  while (
    obj.exp.current >= obj.exp.total &&
    obj.level.current < obj.level.total
  ) {
    obj.level.current++;
    obj.exp.current -= obj.exp.total;
    obj.exp.total = Parser.evaluate(expFormula, {
      n: obj.level.current + 1,
    });
  }
}
