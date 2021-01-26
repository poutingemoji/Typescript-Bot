import { Parser } from "expr-eval";
import { Schema } from "mongoose";
import { expFormulas, ascensions } from "../../utils/enumHelper";
import artifactSchema from "./artifact";
import characterSchema from "./character";
import weaponSchema from "./weapon";
export default new Schema({
  discordId: String,
  ar: {
    cur: { type: Number, default: 1 },
    max: { type: Number, default: ascensions[2].ar },
  },
  exp: {
    cur: { type: Number, default: 0 },
    max: {
      type: Number,
      default: Parser.evaluate(expFormulas.mediumSlow, { lvl: 2 }),
    },
  },
  mora: { type: Number, default: 0 },
  characters: {
    type: Map,
    of: characterSchema,
    default: {
      traveler: {},
    },
  },
  inventory: {
    weapons: {
      type: Array,
      of: weaponSchema,
      default: [
        { id: "dullBlade" },
        { id: "wasterGreatsword" },
        { id: "beginnersProtector" },
        { id: "apprenticesNotes" },
        { id: "huntersBow" },
      ],
    },
    artifacts: {
      type: Array,
      of: artifactSchema,
    },
    characterDevelopmentItems: {
      type: Map,
      of: Number,
    },
    food: {
      type: Map,
      of: Number,
    },
    materials: {
      type: Map,
      of: Number,
      default: { butterflyWings: 1, fetters: 1, apple: 1 },
    },
    gadget: {
      type: Map,
      of: Number,
    },
    quests: {
      type: Map,
      of: Number,
    },
    preciousItems: {
      type: Map,
      of: Number,
    },
  },
});
