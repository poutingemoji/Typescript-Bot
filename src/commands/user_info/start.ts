import Command from "../../base/Command";
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
    //const player = await this.getPlayer(msg.author);
    //if (!player) return;
    this.replacePlayer(msg.author.id);
    //await this.addExpToPlayer(player, 1000);
    // this.buildEmbed({ title: "ya", color: "#c362cb" }, { author: msg.author })
    /*
    const response = await this.awaitResponse(msg, "REACTION", {
      chooseFrom: ["💚", "💙"],
      deleteOnResponse: true,
    });
    */
   const response = await this.confirmation(msg, "YES");
    console.log("RESPONSE", response);
    return;
  }
}
