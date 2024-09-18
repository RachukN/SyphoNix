import React, { useState } from "react";

function MultipleImageUpload() {
  // Типізуємо стан як масив файлів типу FileList або пустий масив
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Типізуємо подію як ChangeEvent для HTMLInputElement
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = () => {
    if (!selectedFiles) return; // Якщо файли не вибрані, не виконуємо завантаження

    const formData = new FormData();

    // Додаємо всі вибрані файли у форму
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    fetch("http://localhost:5059/api/Image/upload-multiple", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Images uploaded with IDs:", data.ImageIds);
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Images</button>
    </div>
  );
}

export default MultipleImageUpload;
