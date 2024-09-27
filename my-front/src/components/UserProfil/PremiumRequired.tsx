import React from 'react';
import './Profile.css'
const PremiumRequired: React.FC = () => {
  return (
    <div className='page'>
        <div className="subscription-card-d">
          <h2 className='h2'>Схоже у вас безкоштовний обліковий запис</h2>
          <h4 className='h22'>Для використання програми вам потрібно придбати PREMIUM</h4>
          <button
            className="premium-btn-d"
            onClick={() => {
              window.location.href = 'https://www.spotify.com/premium/';
            }}
          >
            Придбати Spotify Premium
          </button>
        </div>
      </div>
  );
};

export default PremiumRequired;
