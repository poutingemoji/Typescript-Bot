import { Material, Food, WeaponAscensionMaterial } from "../database/items/classes";
export default {
  butterflyWings: new Material({
    id: "butterflyWings",
    rarity: 1,
    emoji: "🦋",
  }),
  apple: new Food({
    id: "apple",
    rarity: 1,
    emoji: "🍎",
  }),
  fetters: new WeaponAscensionMaterial({
    id: "fetters",
    rarity: 2,
    emoji: "🔗",
  }),
};
