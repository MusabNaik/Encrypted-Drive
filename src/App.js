import React, { useState } from 'react';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './GoogleAuth';
import FileUpload from './FileUpload';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clientId = '761043493236-mpvo1l2ppqusk3jt7t6o3jjv8tnnt8vs.apps.googleusercontent.com';

  const onSuccess = (response) => {
    console.log('Google authentication successful:', response);
    setAccessToken(response.access_token);
    setIsAuthenticated(true);
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
          <td><a href="https://musabnaik.com/Encrypted-Drive/" style={{ color: 'white', fontSize: '18px' }}>Home</a></td>
          <td>  </td>
          <td>  </td>
          <td>  </td>   
          <td><a href="https://musabnaik.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '18px' }}>Privacy Policy</a></td>
          <td>  </td>
          <td>  </td>
          <td>  </td>
          <td><a href="https://musabnaik.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '18px' }}>Musab Naik</a></td>
        </table>
        
        {!isAuthenticated && (
          <>
            <h4 style={{marginBottom: '0px',}}>About App</h4>
            <p style={{fontSize: '20px', width: '70%', textAlign: 'center', marginTop: '0px', marginBottom: '0px'}}>
              This app allows you to securely encrypt your files locally before uploading them to your Google Drive. 
              This ensures that only you with the password can access your sensitive data. You can easily retrieve original 
              unencrypted files by entering the password used for encryption. The app supports all file types.
            </p>
            <h4 style={{marginBottom: '0px'}}>How We Use Your Data</h4>
            <p style={{fontSize: '20px', width: '70%', textAlign: 'center', marginTop: '0px'}}>
              The app uses Google OAuth to authenticate and gain access to your Google Drive. The app creates a dedicated 
              folder named "Encrypted-Drive" where all encrypted files are stored. The app does not access any other files 
              or folders in your Google Drive. All encryption and decryption processes occur locally on your device, 
              ensuring that unencrypted data and passwords never leave your device.
            </p>
          </>
          )
        }
        
        <br></br>
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