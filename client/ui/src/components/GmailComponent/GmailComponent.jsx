import React, { useEffect, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

function GmailComponent() {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => setGapiLoaded(true);
      document.body.appendChild(script);
    };

    const loadGis = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => setGisLoaded(true);
      document.body.appendChild(script);
    };

    loadGapi();
    loadGis();
  }, []);

  useEffect(() => {
    if (gapiLoaded) {
      window.gapi.load('client', initializeGapiClient);
    }
  }, [gapiLoaded]);

  useEffect(() => {
    if (gisLoaded) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Defined later
      });
      setTokenClient(client);
    }
  }, [gisLoaded]);

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiLoaded && gisLoaded) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  };

  const handleAuthClick = () => {
    tokenClient.callback = async (response) => {
      if (response.error) {
        throw response;
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listLabels();
    };

    if (!window.gapi.client.getToken()) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setLabels([]);
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  };

  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({ userId: 'me' });
      const labels = response.result.labels;
      setLabels(labels || []);
    } catch (error) {
      console.error('Error listing labels:', error);
    }
  };

  return (
    <div>
      <h2>Gmail API Quickstart</h2>
      <button id="authorize_button" onClick={handleAuthClick} style={{ visibility: 'hidden' }}>Authorize</button>
      <button id="signout_button" onClick={handleSignoutClick} style={{ visibility: 'hidden' }}>Sign Out</button>
      <pre>{labels.length ? labels.map(label => label.name).join('\n') : 'No labels found'}</pre>
    </div>
  );
}

export default GmailComponent;
