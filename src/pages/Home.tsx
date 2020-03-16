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

import React, { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const [checked, setChecked] = useState(false);

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
              checked={checked}
              onIonChange={e => setChecked(e.detail.checked)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
