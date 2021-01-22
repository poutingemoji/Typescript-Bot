export const talkedRecently = new Set();
export const waitingOnResponse = new Set();
export const isInBattle = new Set();
export const links = {
  website: "https://poutingemoji.github.io/poutingbot/",
  commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
  supportServer: "",
};
export const commandGroups = {
  administrative: "Administrative Commands",
  adventure: "Adventure Commands",
  fighting: "Fighting Commands",
  general_info: "General Info Commands",
  user_info: "User Info Commands",
};
export const expFormulas = {
  fast: "floor(((4*n)^3)/5)",
  mediumFast: "floor(n^3)",
  mediumSlow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
  slow: "floor(((5*n)^3)/4)",
};
