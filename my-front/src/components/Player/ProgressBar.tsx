import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to detect the current route

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
  const location = useLocation();

  // Function to return the correct player design based on the route
  const renderPlayerDesign = () => {
    if (location.pathname === '/infomusic') {
      return (
        <div className="">
          <div style={{ display: 'flex' }}>
            {inactiveImagePaths.map((inactiveImagePath, index) => (
              <img
                key={index}
                src={index < activeBlocks ? activeImagePaths[index] : inactiveImagePath} // Switch between active and inactive images
                alt={`progress-icon-${index}`}
                style={{
                  margin: '3px',
                  objectFit: 'contain',
                  filter: index < activeBlocks ? ' invert(11%) brightness(20000%)' : '', // Adjust filter for green color
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Default player design
    return (
      <div className="">
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
      </div>
    );
  };

  return (
    <div className="">
      {renderPlayerDesign()}
    </div>
  );
};

export default ProgressBar;
