import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas, ascensions } from "../../utils/enumHelper";
import artifactSchema from "../schemas/artifact";
import characterSchema from "../schemas/character";
import weaponSchema from "../schemas/weapon";
import characters from "../../data/characters";
import {IPlayerModel} from "./types"
import { findOneOrCreate } from "./statics";

const PlayerSchema = new Schema ({
  discordId: String,
  gender: String,
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
  mora: { type: Number, default: 50000 },
  primogem: { type: Number, default: 1000 },
  pity4: { type: Number, default: 0 },
  pity5: { type: Number, default: 0 },
  characters: {
    type: Map,
    of: characterSchema,
    default: {
      traveler: characters["traveler"],
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

//PlayerSchema.statics.findOneOrCreate = findOneOrCreate;

export default PlayerSchema;