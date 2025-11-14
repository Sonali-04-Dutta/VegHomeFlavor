import React, { useState } from 'react';
import "./Home.css";
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState("all");

  return (
    <div>
      {/* 🏠 Home Section */}
      <section id="home">
        <Header />
      </section>

      {/* 🍴 Menu Section */}
      <section id="menu">
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </section>

      {/* 📱 Mobile App Section */}
      <section id="mobile-app">
        <AppDownload />
      </section>

      {/* ✉️ Contact Section */}
      <section id="contact">
        <footer>
          {/* if you have a Contact section, or can use your Footer */}
        </footer>
      </section>
    </div>
  );
};

export default Home;
