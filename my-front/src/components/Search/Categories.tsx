import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; // Make sure you create this CSS file for styling

import PopImage from '../../images/Categories.png';
import RockImage from '../../images/Categories (1).png';
import HipHopImage from '../../images/Categories (2).png';
import ElectronicImage from '../../images/Categories (3).png';
import ClassicalImage from '../../images/Categories (4).png';
import JazzImage from '../../images/Categories (5).png';
import RnBImage from '../../images/Categories (6).png';
import CountryImage from '../../images/Categories (7).png';
import MetalImage from '../../images/Categories (8).png';
import RapImage from '../../images/Categories (9).png';
import IndieImage from '../../images/Categories (10).png';
import BluesImage from '../../images/Categories (11).png';
import PartyImage from '../../images/Categories (12).png';
import RelaxImage from '../../images/Categories (13).png';
import WorkoutImage from '../../images/Categories (14).png';
import TravelImage from '../../images/Categories (15).png';
import RomanceImage from '../../images/Categories (16).png';
import SleepImage from '../../images/Categories (17).png';
import SixtiesImage from '../../images/Categories (18).png';
import SeventiesImage from '../../images/Categories (19).png';
import EightiesImage from '../../images/Categories (20).png';
import NinetiesImage from '../../images/Categories (21).png';
import TwoThousandsImage from '../../images/Categories (22).png';
import TwentyTensImage from '../../images/Categories (23).png';
import MusicImage from '../../images/Categories (24).png';
import PodcastsImage from '../../images/Categories (25).png';
import ForYouImage from '../../images/Categories (26).png';
import { useTheme } from '../../services/ThemeContext';

// Continue importing all required images for the categories...

const categories = [
  { name: 'Поп', image: PopImage, route: '/category/pop' },
  { name: 'Рок', image: RockImage, route: '/category/rock' },
  { name: 'Хіп-хоп', image: HipHopImage, route: '/category/hiphop' },
  { name: 'Електронна', image: ElectronicImage, route: '/category/electronic' },
  { name: 'Класика', image: ClassicalImage, route: '/category/classical' },
  { name: 'Джаз', image: JazzImage, route: '/category/jazz' },
  { name: 'R&B', image: RnBImage, route: '/category/rnb' },
  { name: 'Кантрі', image: CountryImage, route: '/category/country' },
  { name: 'Метал', image: MetalImage, route: '/category/metal' },
  { name: 'Реп', image: RapImage, route: '/category/rap' },
  { name: 'Інді', image: IndieImage, route: '/category/indie' },
  { name: 'Блюз', image: BluesImage, route: '/category/blues' },
  { name: 'Для вечірки', image: PartyImage, route: '/category/party' },
  { name: 'Розслаблення', image: RelaxImage, route: '/category/relax' },
  { name: 'Для тренувань', image: WorkoutImage, route: '/category/workout' },
  { name: 'Для подорожей', image: TravelImage, route: '/category/travel' },
  { name: 'Романтика', image: RomanceImage, route: '/category/romance' },
  { name: 'Для сну', image: SleepImage, route: '/category/sleep' },
  { name: '60-ті', image: SixtiesImage, route: '/category/60s' },
  { name: '70-ті', image: SeventiesImage, route: '/category/70s' },
  { name: '80-ті', image: EightiesImage, route: '/category/80s' },
  { name: '90-ті', image: NinetiesImage, route: '/category/90s' },
  { name: '2000-ні', image: TwoThousandsImage, route: '/category/2000s' },
  { name: '2010-ні', image: TwentyTensImage, route: '/category/2010s' },
  { name: 'Музика', image: MusicImage, route: '/category/music' },
  { name: 'Подкасти', image: PodcastsImage, route: '/category/podcasts' },
  { name: 'Для вас', image: ForYouImage, route: '/category/foryou' },
];

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleCategoryClick = (category: { route: string; name: string; image: string }) => {
    // Передаємо об'єкт category
    navigate(category.route, { state: { name: category.name, image: category.image } });
  };

  return (
    <div className="categories-container">
      <h2 className={`categories-title ${isDarkMode ? 'dark' : 'light'}`}>Весь каталог</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-card ${isDarkMode ? 'dark' : 'light'}`}
            onClick={() => handleCategoryClick(category)} // Передаємо весь об'єкт category
          >
            <img src={category.image} alt={category.name} className="category-image" />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
