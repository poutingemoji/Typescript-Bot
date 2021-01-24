import { capitalCase, snakeCase } from "change-case";
import emojis from "../../data/emojis";

export interface InstanceParameters {
  id: string;
  emoji?: string;
  description?: string;
}

export class Instance {
  public readonly id: string;
  public readonly name: string;
  public readonly emoji: string;
  public readonly description: string;
  constructor({ id, emoji, description = "" }: InstanceParameters) {
    this.id = id;
    this.name = capitalCase(id);
    this.emoji = emoji ? emoji : emojis[snakeCase(id)] || "";
    this.description = description;
  }
};
