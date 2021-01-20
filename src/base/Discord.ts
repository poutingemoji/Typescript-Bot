import { snakeCase } from "change-case";
import {
  Message,
  MessageAttachment,
  MessageEmbed,
  MessageEmbedOptions,
  User,
} from "discord.js";
import {
  Command as CommandoCommand,
  CommandInfo,
  CommandoClient,
} from "discord.js-commando";
import emojis from "../data/emojis";
import { waitingOnResponse } from "../utils/enumHelper";
import { containsOnlyEmojis } from "../utils/Helper";
import { Embeds } from "discord-paginationembed";

interface MessageEmbedCustomOptions {
  embed?: MessageEmbed | Embeds;
  author?: User;
  file?: {
    path: string;
    name?: string;
  };
}

interface MessageEmbedsOptions extends MessageEmbedCustomOptions {
  title: string;
  pageLength: number;
  startingIndex: number;
  globalNumbering: boolean;
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

export default class Discord extends CommandoCommand {
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

  protected async buildEmbeds(
    msg,
    data: object,
    formatFilter: (item, i: number) => string,
    options: MessageEmbedsOptions
  ) {
    const {
      author,
      title,
      pageLength,
      startingIndex,
      globalNumbering,
    } = options;
    if (data instanceof Map) data = Array.from(data.keys());
    if (data instanceof Array) data = { "": data };
    const firstKey = Object.keys(data)[0];
    if (data[firstKey].length == 0)
      return msg.reply(
        `Your \`${title} | ${
          firstKey.length == 0 ? "" : firstKey
        }\` is empty. 😔`
      );

    const categories = Object.keys(data);
    const embeds = [];
    let startingPage = 1;
    let globalIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const categoryData = data[categories[i]];
      const { maxPage } = this.paginate(categoryData, 1, pageLength);
      for (let page = 0; page < maxPage; page++) {
        const { items } = this.paginate(categoryData, page + 1, pageLength);
        let description = "";
        console.log("ITEMS", items);
        for (let i = 0; i < items.length; i++) {
          if (globalIndex == startingIndex) startingPage = page + 1;
          description += `${await formatFilter(
            items[i],
            globalNumbering ? globalIndex : i
          )}\n`;
          globalIndex++;
        }
        embeds.push(
          new MessageEmbed()
            .setTitle(
              `${author ? `${author.username}'s ` : ""}${title}${
                categories[i] !== "" ? ` | ${categories[i]}` : ""
              }`
            )
            .setDescription(description)
            .setFooter(`Page ${page} of ${maxPage}`)
        );
      }
    }
    delete options.title;
    console.log("STARTING PAGE", startingPage);
    options.embed = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setPage(startingPage)
      .setClientAssets({
        msg,
        prompt: "{{user}}, Which page would you like to see?",
      })
      .setNavigationEmojis({
        back: "⬅️",
        delete: emojis.red_cross,
        forward: "➡️",
        jump: "🔢",
      })
      .setDisabledNavigationEmojis(["delete"])
      .setPageIndicator("footer");
    await this.buildEmbed(options).build();
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

  private paginate(items, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;
    return {
      items:
        items.length > pageLength
          ? items.slice(startIndex, startIndex + pageLength)
          : items,
      page,
      maxPage,
      pageLength,
    };
  }
}
