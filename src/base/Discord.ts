import { snakeCase } from "change-case";
import {
  Message,
  MessageAttachment,
  MessageEmbed,
  MessageEmbedOptions,
  User,
} from "discord.js";
import { Command as BaseCommand, CommandInfo, CommandoClient } from "discord.js-commando";
import emojis from "../data/emojis";
import { waitingOnResponse } from "../utils/enumHelper";
import { containsOnlyEmojis } from "../utils/Helper";

interface MessageEmbedCustomOptions {
  embed?: MessageEmbed;
  author?: User;
  file?: {
    path: string;
    name?: string;
  };
}

interface AwaitOptions {
  reactToMessage?: boolean;
  removeAllReactions?: boolean;
  removeResponses?: boolean;
  deleteOnResponse?: boolean;
  filter?: () => boolean;
  chooseFrom?: string[];
  responseWaitTime?: number;
}

type AwaitType = "MESSAGE" | "REACTION";

export default class Discord extends BaseCommand {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info);
  }

  protected async awaitResponse(
    author: User,
    msg: Message,
    type: AwaitType,
    options: Partial<AwaitOptions>
  ) {
    const {
      reactToMessage = true,
      removeAllReactions = false,
      removeResponses = false,
      deleteOnResponse = false,
      filter,
      chooseFrom,
      responseWaitTime = 60000,
    } = options;

    if (reactToMessage)
      for (let choice of chooseFrom) await msg.react(emojis[choice] || choice);

    //Wait for a response and then clear from 'waitingOnResponse', return if there isn't a response.
    const messageFilter = (response) => response.author.id == author.id;
    const reactionFilter = (reaction, user) =>
      (chooseFrom.includes(reaction.emoji.id) ||
        chooseFrom.includes(reaction.emoji.name)) &&
      user.id == author.id;
    const awaitParams = { max: 1, time: responseWaitTime, errors: ["time"] };
    waitingOnResponse.add(author.id);
    const collected =
      type == "MESSAGE"
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
      type == "MESSAGE"
        ? collected.first().delete()
        : msg.reactions
            .resolve(
              collected.first().emoji.id
                ? collected.first().emoji.id
                : collected.first().emoji.name
            )
            .users.remove(author.id);
    }
    return type == "MESSAGE"
      ? collected.first().content
      : collected.first().emoji.name;
  }

  protected buildEmbed(
    options: MessageEmbedOptions,
    customOptions?: Partial<MessageEmbedCustomOptions>
  ) {
    const messageEmbed = Object.assign(
      customOptions.embed || new MessageEmbed(),
      options
    );
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

  protected async confirmation(author, msg, response) {
    const awaitOptions: AwaitOptions = {
      chooseFrom: ["green_check", "red_cross"],
    };
    response
      ? (awaitOptions.deleteOnResponse = true)
      : (awaitOptions.removeAllReactions = true);
    const res = await this.awaitResponse(
      response ? msg.author : author,
      response ? await msg.reply(response) : msg,
      "REACTION",
      awaitOptions
    );
    return res == "green_check";
  }

  protected emoji(str: string) {
    const emojiId = this.client.emojis.cache.get(str)
      ? str //already emojiId
      : emojis[emojis.hasOwnProperty(str) ? str : snakeCase(str)]; //was an emoji name or try to make it an emoji name
    if (!this.client.emojis.cache.get(emojiId)) 
      return emojis.hasOwnProperty(str) ? emojiId : str; //return the unicode emoji or the string
    return this.client.emojis.cache.get(emojiId).toString(); //return the custom emoji
  }
}
