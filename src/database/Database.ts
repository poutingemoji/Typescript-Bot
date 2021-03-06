import {MongoDBProvider} from "commando-provider-mongo";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import Discord from "../base/Discord";
config();

export default class Database extends Discord {
  constructor(client, info) {
    super(client, info);

    this.client
      .setProvider(
        MongoClient.connect(process.env.MONGODB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }).then((client) => new MongoDBProvider(client, process.env.MONGODB_URI.substring(64)))
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

  /*
  private async updateDocument(model, filter, update) {
    return await model.updateOne(filter, update, {
      upsert: true,
    });
  }

  private async findDocument(model, filter) {
    return await model.findOne(filter);
  }

  private async replaceDocument(model, filter, update) {
    return await model.replaceOne(filter, update, {
      upsert: true,
    });
  }

  protected async updatePlayer(update) {
    return await this.updateDocument(
      playerModel,
      { discordId: update.discordId },
      update
    );
  }

  protected async findPlayer(discordId) {
    return await this.findDocument(playerModel, { discordId });
  }

  protected async replacePlayer(discordId: string, update?: Object) {
    return await this.replaceDocument(
      playerModel,
      { discordId },
      Object.assign({ discordId }, update)
    );
  }*/
}
