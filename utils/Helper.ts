import { Date } from 'mongoose';

//http://patorjk.com/software/taag/#p=testall&f=Modular
/**
 * Returns a number within a min and max
 * @param int
 * @param min
 * @param max
 * @returns Clamped number
 */
export function clamp(int: number, min: number, max: number): number {
  return int <= min ? min : int >= max ? max : int;
}

/**
 * Returns a boolean if a number is within a min and max
 * @param int
 * @param min
 * @param max
 * @returns Is between
 */
export function isBetween(int: number, min: number, max: number): boolean {
  return (int - min) * (int - max) <= 0;
}

/**
 * Returns a number with commas
 * @param int
 * @returns Number with commas
 */
export function numberWithCommas(int: number): string {
  return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Removes emojis from a string
 * Utilizes https://stackoverflow.com/a/61783246
 * @param text
 * @returns String without emojis
 */
export function containsOnlyEmojis(text: string): string {
  const onlyEmojis = text.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
  return onlyEmojis;
  /*
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
  */
}

/**
 * Returns a codeblock for Discord
 * @param message
 * @param syntax
 * @returns codeblock
 */
export function setImportantMessage(
  message: string,
  syntax: string = ""
): string {
  return `\`\`\`${syntax}\n${message}\`\`\``;
}

export function convertArrayToObject(array: any[], key: string = "id") {
  return array.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
}

/**
 * Fills the given array with the given value x times.
 * @param value
 * @param length
 * @param arr
 * @returns Value
 */
export function fillArray(value: any, length: number, arr: any[] = []) {
  for (let i = 0; i < length; i++) {
    arr.push(value);
  }
  return arr;
}

/**
 * Returns a shallow copy of the object only with filtered properties.
 * Utilizes https://stackoverflow.com/a/38750895
 * @param {Object} raw
 * @param filter
 * @returns {Object} Filtered object
 */
export function filterObject(raw, filter: (arg0: string) => boolean) {
  return Object.keys(raw)
    .filter(filter)
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
}

/**
 * Groups values of an array into categories and returns as an object
 * @param arr
 * @param fn
 * @returns {Object} Grouped array
 */
export function groupBy(arr: any[], fn: (arg0: any) => string) {
  return arr.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    console.log(result);
    return result;
  }, {});
}

/**
 * Recursively checks the object for a property
 * @param {Object} obj
 * @param prop
 * @returns Object has property
 */
export function hasOwnDeepProperty(obj, prop: string): boolean {
  if (typeof obj === "object" && obj !== null) {
    if (obj.hasOwnProperty(prop)) {
      return true;
    }
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns a random number between a min and max
 * Utilizing https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
 * @param min
 * @param max
 * @returns randomNumber
 */
export function randomBetween(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random value from an array
 * @param arr
 * @returns Random value
 */
export function randomChoice(arr: any[]) {
  return arr[randomBetween(0, arr.length - 1)];
}

export function randomWeightedChoice(arr: any[], prop: string = "weight") {
  return randomChoice(
    [].concat(...arr.map((obj) => Array(Math.ceil(obj[prop] * 100)).fill(obj)))
  );
}

/**
 * Returns time passed in seconds since timestamp
 * @param timestamp
 * @returns Time passed in seconds
 */
export function getTimePassed(timestamp: Date | number): number {
  return (new Date().getTime() - timestamp) / 1000;
}

export function secondsToTimeFormat(
  seconds: number,
  conjunction: string = " and ",
  abbreviate: boolean = true
): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  let Display = [
    d > 0 ? d + (abbreviate ? "d" : d == 1 ? " day" : " days") : false,
    h > 0 ? h + (abbreviate ? "h" : h == 1 ? " hour" : " hours") : false,
    m > 0 ? m + (abbreviate ? "m" : m == 1 ? " minute" : " minutes") : false,
    s > 0 ? s + (abbreviate ? "s" : s == 1 ? " second" : " seconds") : false,
  ];

  Display = Display.filter(Boolean);
  if (abbreviate) {
    Display.length = Math.min(Display.length, 2);
  }

  return Display.join(conjunction);
}

/**
 * Put program to sleep for x milliseconds
 * Utilizes https://www.sitepoint.com/delay-sleep-pause-wait/
 */
export async function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/**
 * Utilizing https://stackoverflow.com/a/45332959 to have multiple class inheritance
 */
export function aggregation(baseClass, ...mixins) {
  class base extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach((mixin) => {
        copyProps(this, new mixin(...args));
      });
    }
  }

  //This function copies all properties and symbols, filtering out some special ones.
  let copyProps = (targeted, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          ) &&
          !targeted.hasOwnProperty(prop)
        )
          Object.defineProperty(
            targeted,
            prop,
            Object.getOwnPropertyDescriptor(source, prop)
          );
      });
  };

  //Outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
}
