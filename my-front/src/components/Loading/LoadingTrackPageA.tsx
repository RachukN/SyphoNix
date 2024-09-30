import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Button, List, ListItem, Avatar } from '@mui/material';
import trackImage from './Знімок екрана 2024-09-28 180551.png'
import {
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

const LoadingTrackPage: React.FC = () => {
    return (
        <Box sx={{ position:'fixed',top:0,right:0, paddingLeft: '55px',  backgroundColor: '#1E1E1E', width: '1150px', height: '810px', color: '#FFF' }}>
            {/* Верхня секція з треком */}
            <Box sx={{ display: 'flex', paddingTop: '170px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                {/* Зображення треку та інформація */}
                <Skeleton variant="rectangular" width={1150} height={300} sx={{ right:'30px',top:'80px', borderRadius: '10px', position:'fixed' }} animation="wave" />
               
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={160} height={160} sx={{ marginRight: '20px', borderRadius: '50%' }} animation="wave" />
                    <Box>
                        <Skeleton sx={{ marginBottom: '10px', marginTop: '20px' }} variant="text" width={100} animation="wave" />
                        <Skeleton variant="text" width={300} height={60} animation="wave" />

                        <Skeleton sx={{ marginBottom: '10px', marginTop: '20px' }} variant="text" width={400} animation="wave" />
                    </Box>
                </Box>
                {/* Кнопка додавання до улюблених */}
            </Box>
            
            {/* Секція рекомендацій */}
            <Typography variant="h4" sx={{ color: '#00FF00', marginBottom: '20px', display: 'flex', alignItems: 'center'   }}>
                <Skeleton sx={{ marginRight: '870px',marginTop: '10px', borderRadius: '10px' }}variant="rectangular" width={50} height={20} animation="wave" />
                <Skeleton sx={{marginTop: '30px', borderRadius: '10px'}}variant="rectangular" width={200} height={50} animation="wave" />


            </Typography>
            <List sx={{ width: '100%' }}>
            <Skeleton sx={{marginTop: '-20px', borderRadius: '10px'}}variant="rectangular" width={200} height={40} animation="wave" />

                {Array.from(new Array(3)).map((_, index) => (
                    <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px',marginTop: '15px', }}>
                        <Skeleton variant="rectangular" width={60} height={60} sx={{ marginLeft: '17px',borderRadius: '10px',marginTop: '-10px', }} animation="wave" />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton sx={{ marginLeft: '15px'}} variant="text" width="50%" animation="wave" />
                            <Skeleton sx={{ marginLeft: '15px'}} variant="text" width="30%" animation="wave" />
                        </Box>
                        <Skeleton variant="rectangular" width={40} height={20} sx={{ marginRight: '180px' }} animation="wave" />
                    
                        <Skeleton sx={{ marginRight: '30px' }} variant="text" width="10%" animation="wave" />
                        <Skeleton variant="rectangular" width={40} height={20} sx={{ marginRight: '100px' }} animation="wave" />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const LoadingPageWithSidebarA: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Сайдбар */}
            <LoadingSidebar />
            {/* Основний контент */}
            <LoadingTrackPage />
        </Box>
    );
};

export default LoadingPageWithSidebarA;
