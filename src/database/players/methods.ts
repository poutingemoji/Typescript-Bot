import { Document } from "mongoose";
import { IPlayerDocument } from "./types";

/*
export async function setLastUpdated(this: IPlayerDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    await this.save();
  }
}
export async function sameLastName(this: IPlayerDocument): Promise<Document[]> {
  return this.model("player").find({ lastName: this.lastName });
}
*/

