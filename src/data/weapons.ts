import { convertArrayToObject } from "../utils/Helper";
import { Sword, Claymore, Polearm, Catalyst, Bow } from "../utils/game/Weapon";
export default convertArrayToObject([
  new Sword({
    id: "dullBlade",
    rarity: 1,
    emoji: "🤺",
  }),
  new Claymore({
    id: "wasterGreatsword",
    rarity: 1,
    emoji: "🔪",
  }),
  new Polearm({
    id: "beginnersProtector",
    rarity: 1,
    emoji: "🔱",
  }),
  new Catalyst({
    id: "apprenticesNotes",
    rarity: 1,
    emoji: "📔",
  }),
  new Bow({
    id: "huntersBow",
    rarity: 1,
    emoji: "🏹",
  }),
]);
