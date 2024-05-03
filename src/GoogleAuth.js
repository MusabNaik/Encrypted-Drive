import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ onSuccess, onError, clientId }) => {
  const login = useGoogleLogin({
    clientId,
    onSuccess,
    onError,
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return (
    <button onClick={login}>Sign in with Google 🚀</button>
  );
};

export default GoogleAuth;
