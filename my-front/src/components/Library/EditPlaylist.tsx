import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditPlaylist: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:5059/api/playlists/${playlistId}`);
        setName(response.data.name);
        setDescription(response.data.description);
        setCurrentImage(response.data.imagePath);
      } catch (error) {
        console.error('Failed to fetch playlist', error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleEditPlaylist = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`http://localhost:5059/api/playlists/${playlistId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Playlist updated', response.data);
    } catch (error) {
      console.error('Failed to update playlist', error);
    }
  };

  return (
    <div>
      <h2>Edit Playlist</h2>
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
      {currentImage && <img src={currentImage} alt="Playlist" />}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
      />
      <button onClick={handleEditPlaylist}>Save Changes</button>
    </div>
  );
};

export default EditPlaylist;
