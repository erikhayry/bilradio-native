import { toLocaleTimeString } from "./date";

const ALLOWED_ORIGIN = "sr.se";

function log(message: string, ...args: any[]) {
  console.info(`${toLocaleTimeString(new Date())} - ${message}`, ...args);
}

function isValidImageUrl(url: string | undefined) {
  if (url) {
    return url.indexOf(ALLOWED_ORIGIN) > -1;
  }

  return false;
}

function setToHappen(fn: any, date: Date, action = "") {
  const timeUntil = date.getTime() - new Date().getTime();
  log(`Set to happen`, timeUntil, toLocaleTimeString(date), action);
  return setTimeout(fn, timeUntil);
}

function getSearch() {
  const pairs = window.location.search.substring(1).split("&");
  const obj: Record<string, string> = {};
  let pair;
  let i: string;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}

function base64ToBrowser(buffer: ArrayBuffer): string {
  const base64 = window.btoa(
    [].slice
      .call(new Uint8Array(buffer))
      .map((bin: number) => {
        return String.fromCharCode(bin);
      })
      .join("")
  );

  return `data:image/png;base64,${base64}`;
}

function imageUrlToBase64(url: string): Promise<string> {
  return fetch(url)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(base64ToBrowser);
}

function isDev() {
  const isDev = window.location.host === "localhost:8100";
  log("isDev", isDev);
  return isDev;
}

export {
  log,
  isValidImageUrl,
  setToHappen,
  getSearch,
  imageUrlToBase64,
  isDev
};
