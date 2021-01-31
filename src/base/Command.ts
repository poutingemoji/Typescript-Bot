import { CommandoMessage } from "discord.js-commando";
import { User } from "discord.js";
import artifacts from "../data/artifacts";
import items from "../data/items";
import weapons from "../data/weapons";
import characters from "../data/characters";
import Database from "../database/Database";

import { Weapon } from "../utils/game/Weapon";
import { Character } from "../utils/game/Entity";

export default class Command extends Database {
  constructor(client, info) {
    super(client, info);
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
}
