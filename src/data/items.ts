import { convertArrayToObject } from "../utils/Helper";
import { Material } from "../utils/game/Item";
export default convertArrayToObject([
  new Material({
    id: "butterflyWings",
    rarity: 1,
    emoji: "🦋",
  })
]);
