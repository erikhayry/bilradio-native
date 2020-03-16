import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import './Home.css';

const Home: React.FC = () => {
    LocalNotifications.schedule({
        id: 1,
        text: 'Single ILocalNotification',
        sound: 'file://beep.caf'
    });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nyhetspaus</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Nyhetspaus 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
