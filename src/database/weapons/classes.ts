import weapons from "../../data/weapons.json"
export class Weapon {
  public readonly ATK: number;
  constructor(params) {
    Object.assign(this, weapons[params.id], params)
    this.ATK = 100;
  }
}
