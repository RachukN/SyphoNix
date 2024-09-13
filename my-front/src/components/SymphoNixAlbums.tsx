import React, { useRef } from 'react';
import '../styles/Music.css';

// Імпортуйте зображення альбомів
import Album1 from '../images/Rectangle 2.png';
import Album2 from '../images/Rectangle 2 (1).png';
import Album3 from '../images/Rectangle 2 (2).png';
import Album4 from '../images/Rectangle 2 (3).png';
import Album5 from '../images/Rectangle 2 (4).png';
import Album6 from '../images/Rectangle 2 (5).png';
import Album7 from '../images/Rectangle 2 (6).png';

const SymphoNixAlbums: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const albums = [
    { src: Album1, title: 'Вірусні' },
    { src: Album2, title: 'Реп топ' },
    { src: Album3, title: 'Хіп-хоп топ' },
    { src: Album4, title: 'Топ 50 Україна' },
    { src: Album5, title: 'Топ 100 Весь світ' },
    { src: Album6, title: 'Топ 50 Весь світ' },
    { src: Album7, title: 'Топ пісень Весь світ' },
  ];

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            ref={scrollRef}
            className='music-c'
            style={{
              width: '1100px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {albums.map((album, index) => (
              <div
                key={index}
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                <img
                  src={album.src}
                  alt={album.title}
                  style={{ width: '140px', height: '140px', borderRadius: '5%' }} // Зображення зроблено круглим
                />
                <p className='auth' style={{ margin: '10px 0' }}>{album.title}</p>
                <p style={{ fontSize: 'small', color: '#666' }}>SymphoNix</p> {/* Додає текст "SymphoNix" */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymphoNixAlbums;
