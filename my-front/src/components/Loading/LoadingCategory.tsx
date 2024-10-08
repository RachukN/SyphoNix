import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, List, ListItem } from '@mui/material';

import {
  skeletonListStyle,
  skeletonItemStyle,
  sidebarStyles,
} from './loadingPageStyles';
const LoadingSidebar: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={sidebarStyles}>
     {/* Лого або заглушка лого */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '-7px', marginLeft: '15px' }}>
        <Skeleton sx={{ borderRadius: '10px' }} variant="rectangular" width={55} height={100} animation="wave" />
        <Skeleton sx={{ borderRadius: '10px', marginLeft: '10px' }} variant="rectangular" width={150} height={40} animation="wave" />

      </Box>
      {/* Імітація навігаційних пунктів */}
      <List component="nav">

        <Skeleton variant="text" sx={{ borderRadius: '10px', marginLeft: '15px', width: '150px', height: '50px' }} animation="wave" />
        <Skeleton variant="text" sx={{ borderRadius: '10px', marginLeft: '15px', width: '130px', height: '50px' }} animation="wave" />
        <Skeleton variant="text" sx={{ borderRadius: '10px', marginLeft: '15px', width: '220px', height: '50px' }} animation="wave" />

      </List>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginBottom: '7px' }}>
        <Skeleton sx={{ borderRadius: '10px', width: '150px', height: '40px' }} variant="rectangular" animation="wave" />
        <Skeleton sx={{ borderRadius: '10px', marginLeft: '5px', width: '150px', height: '40px' }} variant="rectangular" animation="wave" />
        <Skeleton sx={{ borderRadius: '10px', marginLeft: '10px', width: '150px', height: '40px' }} variant="rectangular" animation="wave" />

      </Box>
      {/* Плейлисти */}
      {Array.from(new Array(4)).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <Skeleton sx={{borderRadius:'10px'}} variant="rectangular" width={50} height={50} animation="wave" />
            <Box sx={{ marginLeft: '10px' }}>
              <Skeleton variant="text" width="100px" animation="wave" />
              <Skeleton variant="text" width="80px" animation="wave" />
            </Box>
          </Box>
        ))}

    </Box>
  );
};

const LoadingTrackPage: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, right: 0, paddingLeft: '55px', backgroundColor: '#1E1E1E', width: '1150px', height: '810px', color: '#FFF' }}>
      {/* Верхня секція з треком */}
      <Box sx={{ display: 'flex', paddingTop: '170px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        {/* Зображення треку та інформація */}
        <Skeleton variant="rectangular" width={630} height={300} sx={{ left: '385px', top: '80px', borderRadius: '10px', position: 'fixed' }} animation="wave" />

      
      </Box>
      <Box sx={{ display: 'flex', paddingTop: '170px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        {/* Зображення треку та інформація */}
        <Skeleton variant="rectangular" width={480} height={650} sx={{ right: '15px', top: '80px', borderRadius: '10px', position: 'fixed' }} animation="wave" />

      
      </Box>
      {/* Секція рекомендацій */}
      <Typography variant="h4" sx={{ color: '#00FF00', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
       

      </Typography>
      <List sx={{ width: '100%', marginTop: '200px' }}>
        <Skeleton sx={{ marginTop: '-200px', borderRadius: '10px' }} variant="rectangular" width={200} height={40} animation="wave" />
        <List sx={{ width: '100%', marginTop: '20px' }}>
        <Box sx={skeletonListStyle}   >
        {Array.from(new Array(4)).map((_, index) => (
          <Box key={index} sx={skeletonItemStyle}>
            <Skeleton sx={{borderRadius:'15px'}} variant="rectangular" width={150} height={150} animation="wave" />
            <Skeleton variant="text" width="80%" height={35} animation="wave" sx={{ marginTop: '10px' }} />
            <Skeleton variant="text" width="60%" animation="wave" />
          </Box>
        ))}
      </Box>
      </List>
      </List>
    </Box>
  );
};

const LoadingCategories: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Сайдбар */}
      <LoadingSidebar />
      {/* Основний контент */}
      <LoadingTrackPage />
    </Box>
  );
};

export default LoadingCategories;
