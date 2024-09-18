import React, { useState, useEffect } from 'react';

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://localhost:5051/api/Image/all')
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data from API:", data); // Лог для перевірки отриманих даних

        // Додаткове логування для перевірки, чи приходять потрібні поля
        const mappedImages = data.map((image: any, index: number) => {
          console.log('Image object:', image); // Лог кожного окремого об'єкта зображення

          return {
            id: image.id || `${image.fileName}-${index}`, // Використовуємо або id, або комбінацію fileName + index
            name: image.fileName,
            contentType: image.contentType,
            data: image.data,
            src: image.contentType && image.data ? `data:${image.contentType};base64,${image.data}` : '', // Перевірка на наявність даних
          };
        });

        setImages(mappedImages);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  return (
    <div className="image-gallery">
      <h2 className="gallery-title">Галерея зображень</h2>
      <div className="images-container">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            {image.src ? (
              <>
                <img src={image.src} alt={image.name} className="image" />
                <p>{image.name}</p>
              </>
            ) : (
              <p>No image data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
