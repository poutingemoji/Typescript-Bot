import { Weapon } from "../weapons/classes";
import characters from "../../data/characters.json"
import enemies from "../../data/enemies.json";
class Entity {
  
  public readonly stats: { ATK: number; HP: number };
  constructor(params) {
    this.stats = {
      ATK: 100,
      HP: 100,
    };
  }
}

export class Character extends Entity {
  public weapon: Object;
  constructor(params) {
    super(params);
    Object.assign(this, characters[params.id], params)
    this.weapon = new Weapon(params.weapon);
  }
}

export class Enemy extends Entity {
  public readonly emoji: string;
  constructor(params) {
    super(params);
    Object.assign(this, enemies[params.id], params);
  }
}
