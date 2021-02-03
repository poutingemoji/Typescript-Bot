import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas, ascensions } from "../../utils/enumHelper";
import artifactSchema from "../artifacts/schema";
import characterSchema from "../entities/schema";
import weaponSchema from "../weapons/schema";
import characters from "../../data/characters.json";
import { IPlayerModel } from "./types";
import { findPlayer } from "./statics";
import { addCharacter, addExp, addExpToCharacter, addItem } from "./methods";
const PlayerSchema = new Schema({
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
  mora: { type: Number, default: 50000, min: [0, "Not enough Mora"] },
  resin: {
    type: Number,
    default: 160,
    min: [0, "Not enough Resin"],
    max: [160, "Full Resin"],
  },
  primogems: { type: Number, default: 1000, min: [0, "Not enough Primogems"] },
  pity: {
    [5]: { type: Number, default: 0 },
    [4]: { type: Number, default: 0 },
  },
  characters: {
    type: Map,
    of: characterSchema,
    default: {
      jean: characters["jean"],
      amber: characters["amber"],
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
      default: [],
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

PlayerSchema.methods.addExp = addExp;
PlayerSchema.methods.addExpToCharacter = addExpToCharacter;
PlayerSchema.methods.addItem = addItem;
PlayerSchema.methods.addCharacter = addCharacter;

export default PlayerSchema;
