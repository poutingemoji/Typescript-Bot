import MongoDBProvider from "commando-mongodb";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import Discord from "./../base/Discord";
import playerSchema from "./schemas/Player";
config();
const models = {
  Player: mongoose.model("Player", playerSchema),
  //Setting: mongoose.model("Setting", settingSchema),
};

export default class Database extends Discord {
  constructor(client, info) {
    super(client, info)

    this.client
      .setProvider(
        MongoClient.connect(process.env.MONGODB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }).then((client) => new MongoDBProvider(client))
      )
      .catch(console.error);

    mongoose.connection.on("error", (err) => {
      console.error(err);
      this.disconnect();
    });
    process.on("close", () => {
      console.error("Database disconnecting on app termination");
      if (!(mongoose.connection.readyState === 1)) return;
      mongoose.connection.close(() => {
        process.exit(0);
      });
    });
    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        process.exit(0);
      });
    });
    this.connect();
  }

  private async connect() {
    if (!(mongoose.connection.readyState === 0)) return;
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }

  private disconnect() {
    if (!(mongoose.connection.readyState === 1)) return;
    mongoose.connection.close();
  }

  /* 
  
   updateAllPlayers() {
    Player.updateMany(
      {},
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } },
      { upsert: true },
      (err, res) => {
        console.log(res);
      }
    );
  }
  */

  //save
  private async updateDocument(singularCollectionName, filter, update) {
    return await models[singularCollectionName].updateOne(filter, update, {
      upsert: true,
    });
  }

  private async findDocument(singularCollectionName, filter) {
    return await models[singularCollectionName].findOne(filter);
  }

  private async replaceDocument(singularCollectionName, filter, update) {
    return await models[singularCollectionName].replaceOne(filter, update, {
      upsert: true,
    });
  }

  protected async updatePlayer(update) {
    return await this.updateDocument(
      "Player",
      { discordId: update.discordId },
      update
    );
  }

  protected async findPlayer(update) {
    return await this.findDocument("Player", { discordId: update.discordId });
  }

  /**
   * Returns a random value from an array
   * @param arr
   * @returns Random value
   */
  protected async replacePlayer(discordId) {
    return await this.replaceDocument("Player", { discordId }, { discordId });
  }
}
