import { Episode } from "../../typings";
import { isDev, log, setToHappen } from "./index";
import {
  // eslint-disable-next-line import/named
  ILocalNotification,
  LocalNotifications
} from "@ionic-native/local-notifications";
import { parseDateToString } from "./date";

function notify(): void {
  log("Notify");
}

export default class Notifier {
  currentNotifications: ILocalNotification[] = [];
  devCurrentNotifications: NodeJS.Timeout[] = [];
  constructor(onClick: (data: ILocalNotification) => void, done: () => void) {
    log("Notifier init");
    LocalNotifications.on("click").subscribe(onClick);
    LocalNotifications.on("trigger").subscribe((data: ILocalNotification) => {
      if (
        this.currentNotifications.findIndex(
          ({ id }: ILocalNotification) => id === data.id
        ) ===
        this.currentNotifications.length - 1
      ) {
        done();
      }
    });
    LocalNotifications.on("add").subscribe((data: any) => {
      log("Added", data.id);
    });
  }

  async schedule(episodes: Episode[]) {
    log("Notifier - schedule", episodes.length);

    if (isDev()) {
      this.devCurrentNotifications.forEach((timeout: NodeJS.Timeout) =>
        clearTimeout(timeout)
      );
      episodes.forEach(episode => {
        this.devCurrentNotifications.push(
          setToHappen(notify, episode.startTime)
        );
      });
    } else {
      await LocalNotifications.clearAll();
      const items = episodes.map(({ startTime, title, imageUrl, endTime }) => {
        const startTimeString = parseDateToString(startTime);
        const endTimeString = parseDateToString(endTime);
        const id = startTime.getTime();
        const options: ILocalNotification = {
          id,
          title: `Nyhetssändning | ${startTimeString} - ${endTimeString}`,
          text: title,
          trigger: { at: startTime }
        };

        if (imageUrl) {
          log("imageUrl", imageUrl);
          //options.attachments = [imageUrl];
        }

        return options;
      });

      LocalNotifications.schedule(items);
    }
  }
}
