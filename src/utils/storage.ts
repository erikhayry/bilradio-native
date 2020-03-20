import { log } from "./index";
import NativeStorage from "./native/NativeStorage";

export interface IUserData {
  programs: string[];
  channels: string[];
  on: boolean;
}

const userDataInitial: IUserData = {
  programs: [],
  channels: [],
  on: true
};

async function initUser(): Promise<any> {
  return NativeStorage.setItem("user", userDataInitial);
}

async function getUser(): Promise<IUserData> {
  log("get");
  NativeStorage.getItem("user").then(data => {
    console.log("data?", data);
  });
  const userData = await NativeStorage.getItem("user");
  return Promise.resolve(userData || userDataInitial);
}

async function setUser(userData: IUserData): Promise<IUserData> {
  log("set", userData);
  await NativeStorage.setItem("user", userData);
  return getUser();
}

export { getUser, setUser, initUser };
