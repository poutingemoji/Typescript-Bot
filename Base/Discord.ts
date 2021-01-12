import {
  MessageAttachment,
  MessageEmbed,
  MessageEmbedOptions,
  UserResolvable,
} from "discord.js";
import { waitingOnResponse } from "../utils/enumHelper";

interface File {
  path: string;
  name?: string;
}

interface MessageEmbedCustomOptions {
  author?: UserResolvable;
  file?: File;
}

export default class Discord {
  public client: any;
  constructor(client) {
    this.client = client;
  }

  public hi() {
    console.log("hi");
  }

  public buildEmbed(
    options: MessageEmbedOptions,
    customOptions?: Partial<MessageEmbedCustomOptions>
  ) {
    const messageEmbed = Object.assign(new MessageEmbed(), options);
    if (customOptions) {
      if (customOptions.hasOwnProperty("author")) {
        const { author } = customOptions;
        messageEmbed.setTitle(`${author.username}'s ${options.title}`);
      }
      if (customOptions.hasOwnProperty("file")) {
        const { file } = customOptions;
        messageEmbed.attachFiles(
          new MessageAttachment(file.path, `${file.name}.png`)
        );
        messageEmbed.setImage(`attachment://${file.name}.png`);
      }
    }
    return messageEmbed;
  }

  /*
    emoji(str: string) {
    const emojiId = this.client.emojis.cache.get(str)
      ? str //already emojiId
      : emojis[emojis.hasOwnProperty(str) ? str : snakeCase(str)]; //was an emoji name or try to make it an emoji name
    if (!this.client.emojis.cache.get(emojiId)) {
      return emojis.hasOwnProperty(str) ? emojiId : containsOnlyEmojis(str); //return the unicode emoji or a blank string
    }
    return this.client.emojis.cache.get(emojiId).toString(); //return the custom emoji
  }
  */

  async confirmation(author, msg, response) {
    const awaitParams = {
      author: response ? msg.author : author,
      msg: response ? await msg.reply(response) : msg,
      type: "reaction",
      chooseFrom: ["green_check", "red_cross"],
      responseWaitTime: responseWaitTime,
    };
    response
      ? (awaitParams.deleteOnResponse = true)
      : (awaitParams.removeAllReactions = true);
    const res = await this.awaitResponse(awaitParams);
    return res == "green_check";
  }

  async createResponseCollector(
    author,
    msg,
    type,
    { reactToMessage = true, filter, onCollect, onEnd }
  ) {
    if (!["message", "reaction"].includes(type)) return;

    if (type == "reaction") {
      if (!typeof chooseFrom == "object") return;
      if (!Array.isArray(chooseFrom)) chooseFrom = Object.keys(chooseFrom);
      if (reactToMessage)
        for (let choice of chooseFrom)
          await msg.react(emojis[choice] || choice);
    }

    const messageFilter = (response) => response.author.id == author.id;
    const reactionFilter = (reaction, user) =>
      (chooseFrom.includes(reaction.emoji.id) ||
        chooseFrom.includes(reaction.emoji.name)) &&
      user.id == author.id;

    console.log(msg);
    let collector;
    if (type == "message") {
      collector = msg.channel.createMessageCollector(filter || messageFilter);
      collector.on("collect", (message) => {
        //if (removeResponses) message.delete()
        console.log(`Collected ${message.content}`);
        onCollect(message.content);
      });
    } else {
      collector = msg.createReactionCollector(filter || reactionFilter);
      collector.on("collect", (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        onCollect(reaction, user);
      });
    }
    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
      onEnd(collected);
    });
  }

  async awaitResponse(
    author,
    msg,
    type,
    {
      reactToMessage: boolean = true,
      removeAllReactions = false,
      removeResponses = false,
      deleteOnResponse = false,
      filter,
      chooseFrom,
      responseWaitTime,
    }
  ) {
    if (!["message", "reaction"].includes(type)) return;
    waitingOnResponse.add(author.id);

    const awaitParams = { max: 1 };
    if (responseWaitTime) {
      awaitParams.time = responseWaitTime;
      awaitParams.errors = ["time"];
    }

    if (type == "reaction") {
      if (!typeof chooseFrom == "object") return;
      if (!Array.isArray(chooseFrom)) chooseFrom = Object.keys(chooseFrom);
      if (reactToMessage)
        for (let choice of chooseFrom)
          await msg.react(emojis[choice] || choice);
    }

    const messageFilter = (response) => response.author.id == author.id;
    const reactionFilter = (reaction, user) =>
      (chooseFrom.includes(reaction.emoji.id) ||
        chooseFrom.includes(reaction.emoji.name)) &&
      user.id == author.id;
    //Wait for a response and then clear from 'waitingOnResponse', return if there isn't a response.
    const collected =
      type == "message"
        ? await msg.channel
            .awaitMessages(filter || messageFilter, awaitParams)
            .catch(console.error)
        : await msg
            .awaitReactions(filter || reactionFilter, awaitParams)
            .catch(console.error);
    waitingOnResponse.delete(author.id);
    if (collected == null) return;

    //Check other parameters and return response
    if (deleteOnResponse) msg.delete();
    if (removeAllReactions) msg.reactions.removeAll().catch(console.error);
    if (removeResponses) {
      type == "message"
        ? collected.first().delete()
        : msg.reactions
            .resolve(
              collected.first().emoji.id
                ? collected.first().emoji.id
                : collected.first().emoji.name
            )
            .users.remove(author.id);
    }
    return type == "message"
      ? collected.first().content
      : collected.first().emoji.name;
  }
}
