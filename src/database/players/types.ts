import { Document, Model } from "mongoose";
export interface IPlayer {
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
  mora: number;
  primogem: number;
  pity4: number;
  pity5: number;
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
  /*
  setLastUpdated: (this: IPlayerDocument) => Promise<void>;
  sameLastName: (this: IPlayerDocument) => Promise<Document[]>;
  */
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