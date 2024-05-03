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
  const formData = new FormData();

  const metadata = {
    name: file.name,
  };

  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  formData.append('file', file, file.name);

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

export default FileUpload;