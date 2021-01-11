//BASE
import { Command } from "discord.js-commando";

export default class BaseCommand extends Command {
  constructor(client, commandInfo) {
    super(client, commandInfo);
  }
}
