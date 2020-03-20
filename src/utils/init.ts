import { filterPrevEpisodes, getNextEpisodes } from "./data";
import { BackgroundMode } from "@ionic-native/background-mode";
import { isValidImageUrl, log } from "./index";
import { Episode, State } from "../../typings";
import { parseDateToString } from "./date";
import { getUser } from "./storage";
import Notifier from "./notify";
const MINUTE = 1000 * 60;
const state: State = {
  isOn: true,
  nextEpisodes: [] as Episode[],
  notifier: new Notifier(handClick, fetchData),
  fetchInterval: undefined,
  broadcastNotification: undefined,
  onOffNotification: undefined
};

function startFetchInterval(minutes: number) {
  endFetchInterval();
  const time = minutes * MINUTE;
  state.fetchInterval = setInterval(() => {
    log(`Fetch interval done after ${minutes} minute(s)`);
    fetchData();
  }, time);
  log(
    `New fetch interval ${state.fetchInterval} started. Refetch in ${minutes} minute(s).`
  );
}

function endFetchInterval() {
  if (state.fetchInterval) {
    log(`Clear fetch interval ${state.fetchInterval}`);
    clearTimeout(state.fetchInterval);
    state.fetchInterval = undefined;
  }
}

async function fetchData() {
  endFetchInterval();
  state.nextEpisodes = state.nextEpisodes.filter(filterPrevEpisodes);

  if (state.nextEpisodes.length === 0) {
    state.nextEpisodes = await getNextEpisodes();
  }

  log(
    "Fetch Data",
    state.nextEpisodes.map(
      ({ title, startTime, endTime, imageUrl }: Episode) => ({
        title,
        startTime: parseDateToString(startTime),
        endTime: parseDateToString(endTime),
        isValidImageUrl: isValidImageUrl(imageUrl)
      })
    )
  );

  if (state.nextEpisodes.length > 0) {
    state.notifier.schedule(state.nextEpisodes);
  } else {
    startFetchInterval(25);
  }
}

function handClick(data: any) {
  console.log("click", data);
}

async function init() {
  BackgroundMode.enable();
  const userData = await getUser();
  log("userData", userData);
  if (userData.on) {
    fetchData();
  }
}

export { init };
