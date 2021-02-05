import { Document, Model } from "mongoose";
export class IPlayer {
  discordId: string;
  gender: string;
  ar: {
    cur: number;
    max: number;
  };
  exp: {
    cur: number;
    max: number;
  };
  resin: {
    cur: number;
    max: number;
  };
  mora: number;
  primogems: number;
  pity: {
    [5]: number;
    [4]: number;
  };
  characters: Map<string, any>;
  inventory: {
    weapons: [];
    artifacts: [];
    characterDevelopmentItems: Map<string, any>;
    food: Map<string, any>;
    materials: Map<string, any>;
    gadget: Map<string, any>;
    quests: Map<string, any>;
    preciousItems: Map<string, any>;
  };
}

export interface IPlayerDocument extends IPlayer, Document {
  addExp: (this: IPlayerDocument, expToAdd: number) => Promise<void>;
  addExpToCharacter: (
    this: IPlayerDocument,
    expToAdd: number,
    characterId: string
  ) => Promise<void>;
  addCharacter: (this: IPlayerDocument, id: string) => Promise<void>;
  addItem: (this: IPlayerDocument, item, amount?: number) => Promise<void>;
}
export interface IPlayerModel extends Model<IPlayerDocument> {
  findOneOrCreate: (
    this: IPlayerModel,
    {
      firstName,
      lastName,
      age,
    }: { firstName: string; lastName: string; age: number }
  ) => Promise<IPlayerDocument>;
  findByAge: (
    this: IPlayerModel,
    min?: number,
    max?: number
  ) => Promise<IPlayerDocument[]>;
}
