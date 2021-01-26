import { Instance, InstanceParameters } from "./Instance";
import { rarities } from "../enumHelper";
interface ItemParameters extends InstanceParameters {
  rarity: number;
}

export class Item extends Instance {
  public readonly rarity: { emoji: string, hex: string, weight: number };
  constructor(params: ItemParameters) {
    super(params);
    const { rarity } = params;
    this.rarity = rarities[rarity];
  }
}

export class CharacterLevelUpMaterial extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Consumable extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class CookingIngredient extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Food extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Gadget extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Ingredient extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class LocalSpecialtyLiyue extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class LocalSpecialtyMondstadt extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Material extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class Potion extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class QuestItem extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class TalentLevelUpMaterial extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}

export class WeaponAscensionMaterial extends Item {
  constructor(params: ItemParameters) {
    super(params);
  }
}
