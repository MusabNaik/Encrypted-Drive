import React, { useState } from 'react';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './GoogleAuth';
import FileUpload from './FileUpload';

function App() {
  const [accessToken, setAccessToken] = useState('');

  const clientId = '761043493236-mpvo1l2ppqusk3jt7t6o3jjv8tnnt8vs.apps.googleusercontent.com';

  const onSuccess = (response) => {
    console.log('Google authentication successful:', response);
    setAccessToken(response.access_token);
  };

  const onError = (error) => {
    console.error('Google authentication error:', error);
    alert('Google authentication failed. Please try again.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Encrypted Google Drive</h1>
        <p>Files will be encrypted and saved in the 'Encrypted-Drive' folder on the Google Drive</p>
        <GoogleOAuthProvider clientId={clientId}>
          {accessToken ? (
            <FileUpload accessToken={accessToken} />
          ) : (
            <GoogleAuth onSuccess={onSuccess} onError={onError} clientId={clientId} />
          )}
        </GoogleOAuthProvider>
      </header>
    </div>
  );
}

export default App;