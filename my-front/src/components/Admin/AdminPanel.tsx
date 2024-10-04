import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  gender: string;
  birthDay: number;
  birthMonth: string;
  birthYear: number;
  country: string;
  region: string;
  role: string;
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  description: string;
  external_urls: { spotify: string };
}

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  external_urls: { spotify: string };
  uri: string;
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]); // Додаємо стан для артистів
  const [albums, setAlbums] = useState<Album[]>([]); // Додаємо стан для альбомів
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newTrackUri, setNewTrackUri] = useState('');
  const [trackCounts, setTrackCounts] = useState<{ [key: string]: number }>({}); // Стейт для кількості треків

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('https://localhost:5051/api/UserProfile/all');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const fetchUserPlaylists = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (playlistsResponse.data.items && playlistsResponse.data.items.length > 0) {
        setPlaylists(playlistsResponse.data.items);

        const playlistId = playlistsResponse.data.items[0].id;
        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setTracks(tracksResponse.data.items.map((item: any) => item.track));
      } else {
        setPlaylists([]);
        setTracks([]);
      }
    } catch (error) {
      console.error('Error fetching playlists and tracks:', error);
    }
  };

  // Отримання вподобаних артистів
  const fetchUserLikedArtists = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const artistsResponse = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setArtists(artistsResponse.data.artists.items);
    } catch (error) {
      console.error('Error fetching liked artists:', error);
    }
  };

  // Отримання вподобаних альбомів
  const fetchUserLikedAlbums = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const albumsResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAlbums(albumsResponse.data.items.map((item: any) => item.album));
    } catch (error) {
      console.error('Error fetching liked albums:', error);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchUserPlaylists(user.id);
    fetchUserLikedArtists(user.id); // Отримуємо вподобаних артистів
    fetchUserLikedAlbums(user.id); // Отримуємо вподобані альбоми
  };

  const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: [trackUri],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      fetchUserPlaylists(selectedUser!.id);
    } catch (error) {
      console.error('Error adding track:', error);
    }
  };
  const fetchTrackCount = async (userId: string) => {
    try {
      const response = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/track-count`);
      setTrackCounts((prevCounts) => ({
        ...prevCounts,
        [userId]: response.data.trackCount,
      }));
    } catch (error) {
      console.error('Error fetching track count:', error);
    }
  };
  const removeTrackFromPlaylist = async (playlistId: string, trackUri: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios({
        method: 'delete',
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      });

      fetchUserPlaylists(selectedUser!.id);
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.email}</strong> - {user.role} - {user.country}, {user.region}
            <button onClick={() => handleUserSelect(user)}>View Playlists and Liked Items</button>
            <button onClick={() => fetchTrackCount(user.id)}>View Track Count</button>
            {trackCounts[user.id] !== undefined && (
              <p>Tracks listened: {trackCounts[user.id]}</p>
            )}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>User Details</h3>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Name:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
        </div>
      )}

      <h2>Playlists</h2>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <img src={playlist.images[0]?.url} alt={playlist.name} style={{ width: '50px', height: '50px' }} />
              <strong>{playlist.name}</strong> - {playlist.description}
              <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>

              <div>
                <input
                  type="text"
                  value={newTrackUri}
                  onChange={(e) => setNewTrackUri(e.target.value)}
                  placeholder="Track URI"
                />
                <button onClick={() => addTrackToPlaylist(playlist.id, newTrackUri)}>Add Track</button>
              </div>

              <h4>Tracks</h4>
              <ul>
                {tracks.map((track) => (
                  <li key={track.id}>
                    <img src={track.album.images[0]?.url} alt={track.name} style={{ width: '50px', height: '50px' }} />
                    <strong>{track.name}</strong> - {track.artists.map(artist => artist.name).join(', ')}
                    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
                    <button onClick={() => removeTrackFromPlaylist(playlist.id, track.uri)}>Remove Track</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists available.</p>
      )}

      <h2>Liked Artists</h2>
      {artists.length > 0 ? (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '50px', height: '50px' }} />
              <strong>{artist.name}</strong>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked artists available.</p>
      )}

      <h2>Liked Albums</h2>
      {albums.length > 0 ? (
        <ul>
          {albums.map((album) => (
            <li key={album.id}>
              <img src={album.images[0]?.url} alt={album.name} style={{ width: '50px', height: '50px' }} />
              <strong>{album.name}</strong>
              <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked albums available.</p>
      )}
      
    </div>
  );
};

export default AdminPanel;
