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
  CommandoMessage,
} from "discord.js-commando";
import emojis from "../data/emojis";
import { waitingOnResponse } from "../utils/enumHelper";
import { containsOnlyEmojis, convertMapToArray } from "../utils/Helper";
import { Embeds } from "discord-paginationembed";

interface MessageEmbedCustomOptions {
  embed?: MessageEmbed | Embeds;
  author?: User;
  file?: {
    path: string;
    name?: string;
  };
}

interface EmbedsOptions {
  embed?: Embeds;
  author?: User;
  globalIndexing?: boolean;
  pageLength?: number;
  startingIndex?: number;
}

interface AwaitOptions {
  author?: User;
  deleteOnResponse?: boolean;
  reactToMessage?: boolean;
  removeAllReactions?: boolean;
  removeResponse?: boolean;
  chooseFrom?: string[];
  filter?: (...args) => boolean;
  responseWaitTime?: number;
}

type AwaitType = "MESSAGE" | "REACTION";

export default class Discord extends CommandoCommand {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info);
  }

  protected async awaitResponse(
    msg: Message,
    type: AwaitType,
    options: AwaitOptions
  ) {
    const {
      author,
      deleteOnResponse = false,
      removeResponse = false,
      reactToMessage = true,
      removeAllReactions = false,
      chooseFrom,
      filter,
      responseWaitTime = 60000,
    } = options;

    const awaitOptions = { max: 1, time: responseWaitTime };
    if (author) waitingOnResponse.add(author.id);
    let collected;
    switch (type) {
      case "MESSAGE":
        collected = await msg.channel.awaitMessages(function (response) {
          if (author) if (!(response.author.id == author.id)) return;
          if (chooseFrom) if (!chooseFrom.includes(response.content)) return;
          return filter ? filter(response) : true;
        }, awaitOptions);
        if (!checkOptions(collected).size) return;
        if (removeResponse) collected.first().delete();
        return collected.first().content;
      case "REACTION":
        if (reactToMessage)
          for (let choice of chooseFrom)
            await msg.react(emojis[choice] || choice);
        collected = await msg.awaitReactions(function (reaction, user) {
          if (author) if (!(user.id == author.id)) return;
          if (chooseFrom) if (!chooseFrom.includes(reaction.emoji.name)) return;
          return filter ? filter(reaction, user) : true;
        }, awaitOptions);
        if (!checkOptions(collected).size) return;
        if (removeResponse)
          msg.reactions
            .resolve(
              collected.first().emoji.id
                ? collected.first().emoji.id
                : collected.first().emoji.name
            )
            .users.remove(author.id);
        if (removeAllReactions) msg.reactions.removeAll().catch(console.error);
        return collected.first().emoji.name;
    }
    function checkOptions(collected) {
      if (author) waitingOnResponse.delete(author.id);
      if (deleteOnResponse) msg.delete();
      return collected;
    }
  }

  protected buildEmbed(
    options: MessageEmbedOptions,
    customOptions: MessageEmbedCustomOptions = {}
  ): MessageEmbed | Embeds {
    const messageEmbed = Object.assign(
      customOptions.embed || new MessageEmbed(),
      options
    );
    if (customOptions) {
      if (customOptions.hasOwnProperty("author")) {
        const { author } = customOptions;
        if (options.hasOwnProperty("title")) {
          messageEmbed.setTitle(`${author.username}'s ${options.title}`);
        } else {
          messageEmbed.setFooter(
            `Requested by ${author.tag}`,
            author.displayAvatarURL()
          );
        }
      }
      if (customOptions.hasOwnProperty("file")) {
        const { file } = customOptions;
        messageEmbed.attachFiles([
          new MessageAttachment(file.path, `${file.name}.png`),
        ]);
        messageEmbed.setImage(`attachment://${file.name}.png`);
      }
    }
    return messageEmbed;
  }

  protected async buildEmbeds(
    msg: Message,
    data: object,
    formatFilter: (item, i: number) => string,
    options: MessageEmbedOptions = {},
    customOptions: EmbedsOptions = {}
  ) {
    const { title } = options;
    const {
      author = msg.author,
      globalIndexing,
      pageLength,
      startingIndex,
    } = customOptions;
    if (data instanceof Map) data = convertMapToArray(data);
    if (data instanceof Array) data = { "": data };
    for (let prop in data) {
      if (!(data[prop] instanceof Map)) continue;
      data[prop] = convertMapToArray(data[prop]);
    }

    const categories = Object.keys(data);
    if (categories.every((c) => data[c].length == 0))
      return msg.reply(
        `Your \`${title} | ${categories.join(", ")}\` is empty. 😔`
      );

    const array = [];
    let startingPage = 1;
    let globalIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const categoryData = data[categories[i]];
      const { maxPage } = this.paginate(categoryData, 1, pageLength);
      for (let page = 0; page < maxPage; page++) {
        const { items } = this.paginate(categoryData, page + 1, pageLength);
        console.log(page, items);
        let description = "";
        for (let i = 0; i < items.length; i++) {
          if (globalIndex == startingIndex) startingPage = page + 1;
          description += `${formatFilter(
            items[i],
            globalIndexing ? globalIndex : i
          )}\n`;
          globalIndex++;
        }

        array.push(
          this.buildEmbed(
            {
              title: `${title}${
                categories[i].length > 0 ? ` | ${categories[i]}` : ""
              }`,
              description,
              footer: {},
            },
            { author }
          )
        );
      }
    }
    console.log(options.hasOwnProperty("footer"));
    customOptions.embed = new Embeds()
      .setArray(array)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setPage(startingPage)
      .setClientAssets({
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
    delete options.title;
    const embeds = this.buildEmbed(options, customOptions) as Embeds;
    return embeds.build();
  }

  protected async confirmation(msg: Message, response?: string, author?: User) {
    author = author || msg.author;
    const awaitOptions: AwaitOptions = {
      author,
      chooseFrom: ["green_check", "red_cross"],
    };
    response
      ? (awaitOptions.deleteOnResponse = true)
      : (awaitOptions.removeAllReactions = true);
    const res = await this.awaitResponse(
      response ? await msg.channel.send(`${author}, ${response}`) : msg,
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

  private paginate(
    items: unknown[],
    page: number = 1,
    pageLength: number = 10
  ) {
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
