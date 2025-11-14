import React from 'react';
import { Element } from 'react-scroll';
import { assets } from '../../assets/assets';
import './AppDownload.css';

const AppDownload = ({ activeSection }) => {
  const isActive = activeSection === 'app-download';

  return (
    <Element
      name="app-download"
      className={`app-download ${isActive ? 'active-glow' : ''}`}
    >
      <p>
        For a better experience, download the <br />
        <strong>VegHomeDelights App</strong>
      </p>

      <p className="subtext">
        Get exclusive offers, order faster, and track your meals in real-time — all from your phone.
      </p>

      <div className="app-download-platforms">
        <img src={assets.play_store} alt="Play Store" />
        <img src={assets.app_store} alt="App Store" />
      </div>

      <div className="app-download-stats">
        <p>⭐ 4.8/5 · Trusted by 10,000+ happy customers</p>
      </div>
    </Element>
  );
};

export default AppDownload;
