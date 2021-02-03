import { CommandoMessage } from "discord.js-commando";
import { User } from "discord.js";
import Database from "../database/Database";

import { Weapon } from "../database/weapons/classes";
import { Character } from "../database/entities/classes";


export default class Command extends Database {
  constructor(client, info) {
    super(client, info);
  }
}
