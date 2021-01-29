export const talkedRecently = new Set();
export const waitingOnResponse = new Set();
export const isInBattle = new Set();
export const links = {
  commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
  repository: "https://github.com/poutingemoji/Typescript-Bot",
  supportServer: "",
  website: "https://poutingemoji.github.io/poutingbot/",
};
export const commandGroups = {
  administrative: "Administrative Commands",
  adventure: "Adventure Commands",
  fighting: "Fighting Commands",
  general_info: "General Info Commands",
  user_info: "User Info Commands",
};
export const expFormulas = {
  fast: "floor(((4*lvl)^3)/5)",
  mediumFast: "floor(lvl^3)",
  mediumSlow: "floor((6/5*lvl^3)-(15*lvl^2)+(100*lvl)-140)",
  slow: "floor(((5*lvl)^3)/4)",
};
export const ascensions = [
  { lvl: 20, ar: 0 },
  { lvl: 40, ar: 15 },
  { lvl: 50, ar: 25 },
  { lvl: 60, ar: 30 },
  { lvl: 70, ar: 35 },
  { lvl: 80, ar: 40 },
  { lvl: 90, ar: 50 },
];
export const rarities = [
  {
    emoji: "⬜",
    hex: "#e5e7e9",
    weight: 100,
  },
  {
    emoji: "🟩",
    hex: "#79b15a",
    weight: 0,
  },
  {
    emoji: "🟦",
    hex: "#55acef",
    weight: 100,
  },
  {
    emoji: "🟪",
    hex: "#aa8fd6",
    weight: 10,
  },
  {
    emoji: "🟨",
    hex: "#fdcb58",
    weight: 1,
  },
];

export const emojis = {
  green_check: "797756405771534336",
  red_cross: "797755868241461258",
  empty_star: "762389249772617729",
  loading: "730597505938620437",

  //Game
  a_exp: "803535164634038342",
  primogem: "803523016222310472",
  mora: "803523181062783017",
  //Elements
  anemo: "797742183272022027",
  geo: "797742215970816021",
  electro: "797742094470742038",
  dendro: "797741985016184902",
  hydro: "797742281460809748",
  pyro: "797742040901353473",
  cryo: "797742144910655499",

  //Characters

  //Items

  //Talent Types
  attack: "🖱",
  skill: ":regional_indicator_e:",
  burst: ":regional_indicator_q:",
  passive: "🕊️",
};

