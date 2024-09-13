// src/api/spotifyApi.ts
export const fetchArtists = async (ids: string) => {
    try {
        const response = await fetch(`/api/spotify/artists?ids=${ids}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch artists: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};
