import { NativeStorage } from "@ionic-native/native-storage";
import { isDev } from "../index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getItem(key: string): Promise<any> {
  if (isDev()) {
    const data = localStorage.getItem(key);
    return Promise.resolve(data ? JSON.parse(data) : undefined);
  } else {
    try {
      return NativeStorage.getItem(key);
    } catch {
      return Promise.resolve(undefined);
    }
  }
}

async function setItem(key: string, data: any): Promise<any> {
  if (isDev()) {
    const dataSsString = JSON.stringify(data);
    localStorage.setItem(key, dataSsString);
    return Promise.resolve(data);
  } else {
    return NativeStorage.setItem(key, data);
  }
}

export default {
  getItem,
  setItem
};
