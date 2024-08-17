import React, { useState } from 'react';
import axios from 'axios';

const CreatePlaylist: React.FC = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleCreatePlaylist = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5059/api/playlists', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Playlist created', response.data);
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  return (
    <div>
      <h2>Create Playlist</h2>
      <input
        type="text"
        placeholder="Playlist Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Playlist Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
      />
      <button onClick={handleCreatePlaylist}>Create</button>
    </div>
  );
};

export default CreatePlaylist;
