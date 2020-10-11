import React, { useState, useEffect } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonPage,
  IonContent,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import './Login.css';
import contacts, { addContacts, Contact } from '../contacts';
import { useHistory, Redirect } from 'react-router';

interface LoginResponse {
  error?: string;
  data?: Contact[];
}

const Login: React.FC = () => {
  const history = useHistory();
  const [pin, setPin] = useState('');
  const [pinValue, setPinValue] = useState('');

  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      const btn = document.getElementById(
        `digit-${e.key}`
      ) as HTMLIonButtonElement | null;
      if (btn) {
        btn.click();
      }
    }
    window.addEventListener('keypress', listener);
    return () => window.removeEventListener('keypress', listener);
  }, []);

  useEffect(() => {
    if (pinValue) {
      submitPin(pinValue);
    }
    // eslint-disable-next-line
  }, [pinValue]);

  if (contacts.length) return <Redirect to="/contacts" />;

  function clickDigit(digit: number) {
    if (!enabled) return;
    if (digit === -1) {
      setPin('');
    } else {
      const p = `${pin}${digit}`;
      setPin(p);
      if (p.length === 4) {
        setPinValue(p);
        setEnabled(false);
        setPin('****');
      }
    }
  }

  async function submitPin(pin: string) {
    let res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    const json: LoginResponse = await res.json();

    if (json.error) {
      alert(json.error);
      setPin('');
      setEnabled(true);
    } else if (json.data) {
      addContacts(json.data);
      history.push('/contacts');
    }
  }

  function button(digit: number) {
    const back = digit === -1;

    if (back) {
      return (
        <div className="backspace" onClick={() => clickDigit(digit)}>
          <IonIcon icon={closeOutline} />
        </div>
      );
    }

    return (
      <IonButton
        color="dark"
        size="large"
        shape="round"
        fill="outline"
        strong
        onClick={() => clickDigit(digit)}
        disabled={!enabled}
        id={`digit-${digit}`}
      >
        {digit}
      </IonButton>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-container">
          <div className="login-wrapper">
            <IonGrid className="login">
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton
                    expand="full"
                    fill="clear"
                    size="large"
                    color="dark"
                    strong
                    disabled={!enabled}
                  >
                    {pin || 'Enter Pin'}
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4">{button(1)}</IonCol>
                <IonCol size="4">{button(2)}</IonCol>
                <IonCol size="4">{button(3)}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4">{button(4)}</IonCol>
                <IonCol size="4">{button(5)}</IonCol>
                <IonCol size="4">{button(6)}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4">{button(7)}</IonCol>
                <IonCol size="4">{button(8)}</IonCol>
                <IonCol size="4">{button(9)}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4"></IonCol>
                <IonCol size="4">{button(0)}</IonCol>
                <IonCol size="4">{button(-1)}</IonCol>
              </IonRow>
            </IonGrid>
            <br />
            <br />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;