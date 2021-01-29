import { capitalCase, snakeCase } from "change-case";
import { emojis } from "../enumHelper";

export interface InstanceParameters {
  id: string;
  name?: string;
  emoji?: string;
  description?: string;
}

export class Instance {
  public readonly id: string;
  public readonly name: string;
  public readonly emoji: string;
  public readonly description: string;
  constructor({ id, name, emoji = "", description = "" }: InstanceParameters) {
    this.id = id;
    this.name = name || capitalCase(id);
    this.emoji = emojis[snakeCase(id)] || emoji;
    this.description = description;
  }
}
