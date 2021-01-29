import { IPlayerDocument, IPlayerModel } from "./types";
export async function findOneOrCreate(
  this: IPlayerModel,
  discordId: string
): Promise<IPlayerDocument> {
  const record = await this.findOne({ discordId });
  if (record) {
    return record;
  } else {
    return this.create({ discordId });
  }
}
export async function findByAge(
  this: IPlayerModel,
  min?: number,
  max?: number
): Promise<IPlayerDocument[]> {
  return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}
