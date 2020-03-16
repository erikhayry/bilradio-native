import { filterPrevEpisodes, getNextEpisodes } from "./data";
import {
  LocalNotifications
} from "@ionic-native/local-notifications";
import { BackgroundMode } from "@ionic-native/background-mode";
import { isValidImageUrl, log, setToHappen } from "./index";
import { Episode, State } from "../../typings";
import { isInFuture, parseDateToString } from "./date";

BackgroundMode.enable();

const MINUTE = 1000 * 60;
const state: State = {
  isOn: true,
  nextEpisodes: [] as Episode[],
  fetchInterval: undefined,
  notificationTimeout: undefined,
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

async function notify({ title, endTime, startTime, imageUrl }: Episode) {
  const startTimeString = parseDateToString(startTime);
  const endTimeString = parseDateToString(endTime);
  log("Notify", title, startTimeString, endTimeString);

  if (state.broadcastNotification) {
    await LocalNotifications.clear(state.broadcastNotification);
  }

  if (isInFuture(endTime)) {
    const id = startTime.getTime();
    const options: any = {
      id,
      title: `Nyhetssändning | ${startTimeString} - ${endTimeString}`,
      text: title,
      trigger: { at: startTime }
    };

    if (imageUrl) {
      options.attachments = [imageUrl];
    }

    LocalNotifications.schedule(options);
  } else {
    fetchData();
  }
}

const onClick = LocalNotifications.on("click");

onClick.subscribe(data => {
  log(data.id);
});

async function fetchData() {
  endFetchInterval();
  clearTimeout(state.notificationTimeout);
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
    notify(state.nextEpisodes[0]);
  } else {
    startFetchInterval(25);
  }
}

export { fetchData };
