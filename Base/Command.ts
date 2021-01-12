import { Command as BaseCommand, CommandInfo, CommandoClient } from "discord.js-commando";
import Discord from "./Discord";
import {aggregation} from "./../utils/Helper"

export default class Command extends aggregation(BaseCommand, Discord) {
  constructor(client: CommandoClient, commandInfo: CommandInfo) {
    super(client, commandInfo);
  }
}
