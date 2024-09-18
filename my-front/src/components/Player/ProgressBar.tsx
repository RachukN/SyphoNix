import React from 'react';

interface ProgressBarProps {
  position: number;
  duration: number;
  inactiveImagePaths: string[]; // Array of inactive image paths (e.g., inactive SVGs or PNGs)
  activeImagePaths: string[]; // Array of active image paths (e.g., green versions of the images)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ position, duration, inactiveImagePaths, activeImagePaths }) => {
  const totalBlocks = inactiveImagePaths.length;
  const progressPercentage = (position / duration) * 100;
  const activeBlocks = Math.floor((progressPercentage / 100) * totalBlocks);

  return (
    <div style={{ display: 'flex' }}>
      {inactiveImagePaths.map((inactiveImagePath, index) => (
        <img
          key={index}
          src={index < activeBlocks ? activeImagePaths[index] : inactiveImagePath} // Switch between active and inactive images
          alt={`progress-icon-${index}`}
          style={{
            margin: '3px',
            objectFit: 'contain', 
          }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
