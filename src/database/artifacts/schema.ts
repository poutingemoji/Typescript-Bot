import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas, ascensions } from "../../utils/enumHelper";

export default new Schema({
  id: String,
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
});
