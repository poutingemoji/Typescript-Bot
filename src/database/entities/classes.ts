import { Item } from "../Item";
import weapons from "../../data/weapons";

class Entity extends Item {
  public readonly baseStats: { atk: number; hp: number };
  constructor(params) {
    super(params);
    this.baseStats = {
      atk: 100,
      hp: 100,
    };
  }
}

export class Character extends Entity {
  public weapon: Object;
  constructor(params) {
    super(params);
    const { weapon } = params;
    this.weapon = weapons[weapon];
    console.log(this.weapon)
  }
}

export class Enemy extends Entity {
  constructor(params) {
    super(params);
  }
}
