import Command from "../../base/Command";
import { stripIndents } from "common-tags";
export default class StartCommand extends Command {
  constructor(client) {
    super(client, {
      name: "start",
      group: "user_info",
      memberName: "start",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) {
    const player = await this.getPlayer(msg.author);
    if (!player) this.replacePlayer(msg.author.id);
    //await this.addExpToPlayer(player, 1000);
    console.log(player)
    /*
    const response = await this.awaitResponse(msg, "REACTION", {
      chooseFrom: ["💚", "💙"],
      deleteOnResponse: true,
    });
    */
    //const response = await this.confirmation(msg, "YES");
    //console.log("RESPONSE", response);
    return msg.say(
      this.buildEmbed(
        {
          color: "#c362cb",
          title: "Profile",
          description: stripIndents(`
            AR ${player.ar.cur} (${player.exp.cur}/${player.exp.max} EXP)
            ${player.mora} Mora
          `),
        },
        { author: msg.author, file: { path: "src/image.png" } }
      )
    );
  }
}
