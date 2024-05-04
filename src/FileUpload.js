import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ accessToken }) => {
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    // Fetch list of files in 'Encrypted-Drive' folder when component mounts
    fetchFilesList(accessToken);
  }, [accessToken]);

  const fetchFilesList = async (accessToken) => {
    try {
      const folderId = await getOrCreateFolderId('Encrypted-Drive', accessToken);
      const fileList = await listFilesInFolder(folderId, accessToken);
      setFilesList(fileList);
    } catch (error) {
      console.error('Failed to fetch files list:', error);
    }
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      try {
        const response = await uploadToGoogleDrive(file, accessToken);
        console.log('File uploaded successfully:', response);
        alert('File uploaded successfully!');
        // Refresh the files list after upload
        fetchFilesList(accessToken);
      } catch (error) {
        console.error('File upload error:', error);
        alert('File upload failed. Please try again.');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDownload = async (fileId, fileName) => {
    try {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('File download error:', error);
      alert('File download failed. Please try again.');
    }
  };

  return (
    <div>
      <div {...getRootProps()} style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Encrypt and upload files</p>
        <p>Drag and drop a file here, or click to select a file</p>
      </div>

      <div style={{ marginTop: '80px' }}>
        <h2>Files in 'Encrypted-Drive' Folder:</h2>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filesList.map((file) => (
              <tr key={file.id}>
                <td style={{ textAlign: 'left' }}>{file.name}</td>
                <td>
                  <button onClick={() => handleDownload(file.id, file.name)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

async function uploadToGoogleDrive(file, accessToken) {
  const folderName = 'Encrypted-Drive';
  const folderId = await getOrCreateFolderId(folderName, accessToken);

  const metadata = {
    name: file.name,
    parents: [folderId],
  };

  const formData = new FormData();
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

async function getOrCreateFolderId(folderName, accessToken) {
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
    return data.files[0].id;
  } else {
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

async function listFilesInFolder(folderId, accessToken) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name)&orderBy=name`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch files from Google Drive');
  }

  const data = await response.json();
  return data.files;
}

export default FileUpload;
