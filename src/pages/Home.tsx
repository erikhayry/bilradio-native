import {
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar
} from "@ionic/react";

import React, { useEffect, useState } from "react";
import "./Home.css";
import { getUser, IUserData, setUser as saveUser } from "../utils/storage";
import { init } from "../utils/init";

const Home: React.FC = () => {
  const [user, setUser] = useState<IUserData | undefined>(undefined);

  useEffect(() => {
    const runEffect = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    runEffect();
  }, []);

  async function handleToggle(checked: boolean) {
    if (user) {
      const userUpdated = {
        ...user,
        on: checked
      };
      await setUser(userUpdated);
      saveUser(userUpdated);
    }
  }

  useEffect(() => {
    if (user?.on) {
      init();
    }
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nyhetspaus</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItemDivider>Inställningar</IonItemDivider>
          <IonItem>
            <IonLabel>Slå på/av</IonLabel>
            <IonToggle
              disabled={!user}
              checked={user?.on}
              onIonChange={e => handleToggle(e.detail.checked)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
