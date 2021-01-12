import {
  Command as BaseCommand,
  CommandInfo,
  CommandoClient,
} from "discord.js-commando";
import { aggregation } from "../utils/Helper";
import Discord from "./Discord";

export default class Command extends aggregation(BaseCommand, Discord) {
  constructor(client: CommandoClient, commandInfo: CommandInfo) {
    super(client, commandInfo);
  }
}
