import React, { useState, useEffect } from 'react';
import { Skeleton, Box, Typography, List} from '@mui/material';
import {
  sidebarStyles,
  mainContentStyles,
  skeletonTitleStyle,
  skeletonItemStyle,
  skeletonListStyle,
} from './loadingPageStyles'; // Імпорт стилів

const LoadingSidebar: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={sidebarStyles}>
      {/* Лого або заглушка лого */}
       <Box  sx={{ display: 'flex', alignItems: 'center', marginBottom: '-7px',marginLeft: '15px' }}>
            <Skeleton  sx={{borderRadius:'10px'}} variant="rectangular" width={55} height={100}  animation="wave" />
           <Skeleton sx={{borderRadius:'10px', marginLeft: '10px'}} variant="rectangular" width={150} height={40} animation="wave" />
    
          </Box>
      {/* Імітація навігаційних пунктів */}
      <List component="nav">
         
            <Skeleton variant="text" sx={{borderRadius:'10px',marginLeft: '15px',  width:'150px', height:'50px'}} animation="wave" />
            <Skeleton variant="text" sx={{borderRadius:'10px',marginLeft: '15px',  width:'130px', height:'50px'}} animation="wave" />
            <Skeleton variant="text" sx={{borderRadius:'10px',marginLeft: '15px',  width:'220px', height:'50px'}} animation="wave" />
    
      </List>
      <Box  sx={{ display: 'flex', alignItems: 'center',marginTop:'30px', marginBottom: '7px'}}>
            <Skeleton sx={{borderRadius:'10px', width:'150px', height:'40px'}} variant="rectangular"  animation="wave" />
           <Skeleton sx={{borderRadius:'10px', marginLeft: '5px',width:'150px', height:'40px'}} variant="rectangular"  animation="wave" />
           <Skeleton sx={{borderRadius:'10px', marginLeft: '10px',width:'150px', height:'40px'}} variant="rectangular"  animation="wave" />
    
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

const MainContent: React.FC = () => {
  return (
    <Box sx={mainContentStyles}>
      <Typography variant="h4" sx={skeletonTitleStyle}>
        <Skeleton sx={{borderRadius:'10px'}} variant="rectangular" height={30} width={200} animation="wave" />
      </Typography>
      <Box sx={skeletonListStyle}>
        {Array.from(new Array(7)).map((_, index) => (
          <Box key={index} sx={skeletonItemStyle}>
            <Skeleton sx={{borderRadius:'15px'}} variant="rectangular" width={150} height={150} animation="wave" />
            <Skeleton variant="text" width="80%" height={35} animation="wave" sx={{ marginTop: '10px' }} />
            <Skeleton variant="text" width="60%" animation="wave" />
          </Box>
        ))}
      </Box>

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

const LoadingPageWithSidebar: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Сайдбар */}
      <LoadingSidebar />

      {/* Основний контент */}
      <MainContent />
    </Box>
  );
};

export default LoadingPageWithSidebar;
