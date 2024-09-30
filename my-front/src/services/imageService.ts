const BACKEND_URL = 'https://localhost:5051';

export interface Image {
  id: number;
  imageName: string;
  imageUrl: string;
}

export const fetchImages = async (): Promise<Image[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/Images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};
