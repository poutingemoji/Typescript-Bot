import { snakeCase } from "change-case";
import {
  DMChannel,
  TextChannel,
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
  embed: MessageEmbed | Embeds;
  author: User;
  file: {
    path: string;
    name?: string;
  };
}

interface EmbedsOptions {
  embed: Embeds;
  author: User;
  title: string;
  pageLength: number;
  startingIndex: number;
  globalIndexing: boolean;
}

interface AwaitOptions {
  author: User;
  deleteOnResponse: boolean;
  reactToMessage: boolean;
  removeAllReactions: boolean;
  removeResponse: boolean;
  chooseFrom: string[];
  filter: (...args) => boolean;
  responseWaitTime: number;
}

type AwaitType = "MESSAGE" | "REACTION";

export default class Discord extends CommandoCommand {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info);
  }

  protected async awaitResponse(
    msg: Message,
    type: AwaitType,
    options: Partial<AwaitOptions>
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
    customOptions?: Partial<MessageEmbedCustomOptions>
  ): MessageEmbed | Embeds {
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
    options: MessageEmbedOptions,
    customOptions: EmbedsOptions
  ) {
    const {
      author,
      title,
      pageLength,
      startingIndex,
      globalIndexing,
    } = customOptions;
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
    const array = [];
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
            globalIndexing ? globalIndex : i
          )}\n`;
          globalIndex++;
        }
        array.push(
          new MessageEmbed()
            .setTitle(
              `${author ? `${author.username}'s ` : ""}${title}${
                categories[i].length > 0 ? ` | ${categories[i]}` : ""
              }`
            )
            .setDescription(description)
            .setFooter(`Page ${page} of ${maxPage}`)
        );
      }
    }
    delete options.title;
    console.log("STARTING PAGE", startingPage);
    customOptions.embed = new Embeds()
      .setArray(array)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel as TextChannel | DMChannel)
      .setPage(startingPage)
      .setClientAssets({
        message: msg,
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
    const embeds = this.buildEmbed(options, customOptions) as Embeds;
    embeds.build();
  }

  protected async confirmation(msg: Message, response?: string) {
    const awaitOptions: Partial<AwaitOptions> = {
      author: msg.author,
      chooseFrom: ["green_check", "red_cross"],
    };
    response
      ? (awaitOptions.deleteOnResponse = true)
      : (awaitOptions.removeAllReactions = true);
    const res = await this.awaitResponse(
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

  private paginate(items: unknown[], page: number = 1, pageLength: number = 10) {
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
