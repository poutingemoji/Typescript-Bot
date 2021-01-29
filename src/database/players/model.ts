import { model } from "mongoose";
import { IPlayerDocument } from "./types";
import PlayerSchema from "./schema";
export const PlayerModel = model<IPlayerDocument>("player", PlayerSchema);
