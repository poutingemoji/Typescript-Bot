import { IPlayerDocument, IPlayerModel } from "./types";
export async function findPlayer(this: IPlayerModel, user, options) {
  const { msg, lean } = options;
  const record = lean
    ? await this.findOne({ discordId: user.id }).lean()
    : await this.findOne({ discordId: user.id });
  if (!record) {
    msg.reply(`Please type \`${msg.guild.commandPrefix}start\` to begin.`);
  } else {
    return record;
  }
}

export async function findByAge(
  this: IPlayerModel,
  min?: number,
  max?: number
): Promise<IPlayerDocument[]> {
  return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}
