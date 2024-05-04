import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ accessToken }) => {
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      try {
        const response = await uploadToGoogleDrive(file, accessToken);
        console.log('File uploaded successfully:', response);
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('File upload error:', error);
        alert('File upload failed. Please try again.');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag and drop a file here, or click to select a file</p>
    </div>
  );
};

async function uploadToGoogleDrive(file, accessToken) {
  // 1. Check if 'Encrypted-Drive' folder exists or create it
  const folderName = 'Encrypted-Drive';
  let folderId = await getOrCreateFolderId(folderName, accessToken);

  // 2. Prepare metadata for the file
  const metadata = {
    name: file.name,
    parents: [folderId], // Assign the folder ID as the parent
  };

  // 3. Create form data for the request
  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', file, file.name);

  // 4. Upload the file to Google Drive within the specified folder
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to Google Drive');
  }

  return response.json();
}

async function getOrCreateFolderId(folderName, accessToken) {
  // 1. Check if the folder already exists
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch folder information from Google Drive');
  }

  const data = await response.json();

  if (data.files.length > 0) {
    // Folder exists, return its ID
    return data.files[0].id;
  } else {
    // 2. If folder doesn't exist, create it
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(folderMetadata),
    });

    if (!createFolderResponse.ok) {
      throw new Error('Failed to create folder in Google Drive');
    }

    const folderData = await createFolderResponse.json();
    return folderData.id;
  }
}

export default FileUpload;