import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Ensure you have a CSS file for styling this form
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import TopNavigation from '../Navigation/TopNavigation';

const EditProfile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Жінка');
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState('Березень');
  const [year, setYear] = useState(2003);
  const [country, setCountry] = useState('Україна');
  const [region, setRegion] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch the user profile on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('spotifyUserId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId);
    }
  }, []);

  const fetchUserProfile = async (id: string) => {
    try {
      const response = await axios.get(`https://localhost:5051/api/UserProfile/${id}`);
      const profile = response.data;
      setEmail(profile.email);
      setGender(profile.gender || 'Жінка');
      setDay(profile.birthDay || 1);
      setMonth(profile.birthMonth || 'Січень');
      setYear(profile.birthYear || 2000);
      setCountry(profile.country || 'Україна');
      setRegion(profile.region || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSave = async () => {
    const updatedProfile = {
      gender,
      birthDay: day,
      birthMonth: month,
      birthYear: year,
      country,
      region,
    };

    try {
      await axios.put(`https://localhost:5051/api/UserProfile/${userId}`, updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (

    <div className='content' >
      <Sidebar />

      <div className="edit-profile" >
        <TopNavigation />
        <h2>Редагувати профіль</h2>
        <form className="edit-profile-form">
          <label htmlFor="email">Електронна пошта</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />



          <label>Стать та дата народження</label>
          <div className="row">
            <select  className='chol' value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Жінка">Жінка</option>
              <option value="Чоловік">Чоловік</option>
              <option value="Небінарний">Небінарний</option>
              <option value="Краще не говорити">Краще не говорити</option>
              <option value="Інше">Інше</option>
            </select>
            <select className='chol' value={day} onChange={(e) => setDay(parseInt(e.target.value))}>
              {[...Array(31).keys()].map((d) => (
                <option key={d + 1} value={d + 1}>
                  {d + 1}
                </option>
              ))}
            </select>
            <select className='chol' value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="Січень">Січень</option>
              <option value="Лютий">Лютий</option>
              <option value="Березень">Березень</option>
              <option value="Квітень">Квітень</option>
              <option value="Травень">Травень</option>
              <option value="Червень">Червень</option>
              <option value="Липень">Липень</option>
              <option value="Серпень">Серпень</option>
              <option value="Вересень">Вересень</option>
              <option value="Жовтень">Жовтень</option>
              <option value="Листопад">Листопад</option>
              <option value="Грудень">Грудень</option>
            </select>
            <select className='chol' value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
              {Array.from({ length: 100 }, (_, i) => 2024 - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          
            <label htmlFor="country">Країна </label>
            <select  id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="Україна">Україна</option>
            </select>

            <label htmlFor="region">Регіон</label>

            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="Європа">Європа</option>
            </select>
          <div className="buttons">
            <button type="button" className="cancel-button">Скасувати</button>
            <button type="button" className="save-button" onClick={handleSave}>
              Зберегти профіль
            </button>
          </div>
        </form>
        <div className='footer'><Footer /></div>

      </div>

    </div>
  );
};

export default EditProfile;
