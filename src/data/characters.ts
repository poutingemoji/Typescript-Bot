  
import { Character } from "../utils/game/Entity";
import { convertArrayToObject } from "../utils/Helper";
export default convertArrayToObject([
  new Character({
    id: "traveler",
    rarity: 4,
    HP: 100,
    ATK: 100,
    weapon: "dullBlade",
  }),
]);