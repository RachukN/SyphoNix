import React from 'react';
import './Footer.css';
import FacebookIcon from '../../images/Frame 165.png'; // Replace with the correct path
import TwitterIcon from '../../images/Frame 169.png';  // Replace with the correct path
import InstagramIcon from '../../images/Frame 170.png'; // Replace with the correct path

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Компанія</h3>
          <ul>
            <li>Про нас</li>
            <li>Вакансії</li>
            <li>Для запису</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Для слухачів</h3>
          <ul>
            <li>Початок роботи</li>
            <li>Часті запитання (FAQ)</li>
            <li>Оновлення та новини</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Корисні посилання</h3>
          <ul>
            <li>Підтримка</li>
            <li>Безкоштовний мобільний додаток</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Підписки SymphoNix</h3>
          <ul>
            <li>Premium Individual</li>
            <li>Premium Duo</li>
            <li>Premium Family</li>
            <li>Premium Student</li>
            <li>SymphoNix Free</li>
          </ul>
        </div>
        <div className="footer-icons">
          <img src={InstagramIcon} alt="Instagram" />
          <img src={TwitterIcon} alt="Twitter" />
          <img src={FacebookIcon} alt="Facebook" />
        </div>
      </div>
      <div className='border'></div>
      <div className="footer-bottom">
        <p>© 2024 SymphoNix</p>
      </div>
    </footer>
  );
};

export default Footer;
