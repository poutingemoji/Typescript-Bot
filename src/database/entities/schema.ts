import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas, ascensions } from "../../utils/enumHelper";
import weaponSchema from "../weapons/schema"
export default new Schema({
  lvl: {
    cur: { type: Number, default: 1 },
    max: { type: Number, default: ascensions[0].lvl },
  },
  exp: {
    cur: { type: Number, default: 0 },
    max: {
      type: Number,
      default: Parser.evaluate(expFormulas.mediumFast, { lvl: 2 }),
    },
  },
  weapon: weaponSchema,
});
