import React, { useState } from 'react';

const BACKEND_URL = 'https://localhost:5051';

const UploadImages: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [category, setCategory] = useState<string>(''); // Додаємо стан для категорії

  // Функція для обробки вибору файлів
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  // Функція для обробки зміни категорії
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  // Функція для завантаження файлів на сервер
  const handleUpload = async () => {
    if (!selectedFiles || !category) {
      alert('Please select files and enter a category.');
      return;
    }

    const formData = new FormData();
    
    // Додаємо категорію до FormData
    formData.append('category', category);
    
    // Додаємо всі файли до FormData
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/Images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <h2>Upload Images</h2>
      <input type="text" placeholder="Enter category" value={category} onChange={handleCategoryChange} />
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadImages;
