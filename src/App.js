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
        <h1 style={{ marginBottom: '5px' }}>Encrypted Google Drive</h1>        
        <table style={{ marginTop: '5px' }}>    
          <td><a href="https://musabnaik.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '18px' }}>Privacy Policy</a></td>
          <td>  </td>
          <td>  </td>
          <td>  </td>
          <td><a href="https://musabnaik.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '18px' }}>Musab Naik</a></td>
        </table>
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