import { Schema } from "mongoose";
import { Parser } from "expr-eval";
import { expFormulas } from "../../utils/enumHelper";

export default new Schema({
  id: String,
  level: {
    cur: { type: Number, default: 1 },
    max: { type: Number, default: 10 },
  },
  exp: {
    cur: { type: Number, default: 0 },
    max: {
      type: Number,
      default: Parser.evaluate(expFormulas["mediumFast"], { n: 2 }),
    },
  },
});
