import { convertArrayToObject } from "../utils/Helper";
import { Material, Food, WeaponAscensionMaterial } from "../utils/game/Item";
export default convertArrayToObject([
  new Material({
    id: "butterflyWings",
    rarity: 1,
    emoji: "🦋",
  }),
  new Food({
    id: "apple",
    rarity: 1,
    emoji: "🍎"
  }),
  new WeaponAscensionMaterial({
    id: "fetters",
    rarity: 2,
    emoji: "🔗",
  })
]);
