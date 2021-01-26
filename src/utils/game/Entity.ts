import { Item } from "./Item";
import weapons from "../../data/weapons"
export class Character extends Item {
  public weapon: Object
  constructor(params) {
    super(params);
    const { weapon } = params;
    this.weapon = weapons[weapon];
  }
}

export class Enemy extends Item {
  constructor(params) {
    super(params);
  }
}