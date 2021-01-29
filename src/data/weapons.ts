import { Sword, Claymore, Polearm, Catalyst, Bow } from "../utils/game/Weapon";
export default {
  dullBlade: new Sword({
    id: "dullBlade",
    rarity: 1,
    emoji: "804142647782015037",
  }),
  wasterGreatsword: new Claymore({
    id: "wasterGreatsword",
    rarity: 1,
    emoji: "804142639309914113",
  }),
  beginnersProtector: new Polearm({
    id: "beginnersProtector",
    rarity: 1,
    emoji: "804142523320238121",
  }),
  apprenticesNotes: new Catalyst({
    id: "apprenticesNotes",
    rarity: 1,
    emoji: "📔",
  }),
  huntersBow: new Bow({
    id: "huntersBow",
    rarity: 1,
    emoji: "🏹",
  }),
};
