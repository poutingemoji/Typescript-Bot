
import { rarities } from "../../utils/enumHelper";
import  items from "../../data/items.json"
export class Item {
  constructor(params) {
    Object.assign(this, items[params.id], params)
  }
}

/**
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

 */
