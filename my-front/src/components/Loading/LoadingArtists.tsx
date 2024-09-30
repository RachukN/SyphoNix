import React from 'react';
import { Skeleton, Box, Typography} from '@mui/material';
import {
  mainContentStyles,
  skeletonTitleStyle,
  skeletonItemStyle,
} from './loadingPageStyles'; // Імпорт стилів


const MainContent: React.FC = () => {
  return (
    <Box sx={mainContentStyles}>
      

      <Typography variant="h4" sx={skeletonTitleStyle}>
        <Skeleton sx={{borderRadius:'10px'}} variant="rectangular" height={30} width={200} animation="wave" />
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {Array.from(new Array(7)).map((_, index) => (
          <Box key={index} sx={skeletonItemStyle}>
            <Skeleton variant="circular" width={150} height={150} animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" sx={{ marginTop: '10px' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const LoadingArtists: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
     
      <MainContent />
    </Box>
  );
};

export default LoadingArtists;
