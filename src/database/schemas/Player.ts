import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas } from "../../utils/enumHelper";
import characterSchema from "./character";
import weaponSchema from "./weapon";
import artifactSchema from "./artifact";
export default new Schema({
  discordId: String,
  level: {
    cur: { type: Number, default: 1 },
    max: { type: Number, default: 25 },
  },
  exp: {
    cur: { type: Number, default: 0 },
    max: {
      type: Number,
      default: Parser.evaluate(expFormulas["player"], { n: 2 }),
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
