import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'


const Footer = () => {
  return (
    <div className='footer' id='footer'>
          <div className="footer-content">
              <div className="footer-content-left">
                  <h1 className='res_name'>VegHomeFlavour</h1>
                  <p>Bringing you the warmth of home-cooked vegetarian food — pure, fresh, 
            and full of love. Taste the goodness of nature in every bite!</p>
                  <div className="footer-social-icons">
                      
                      <a
                          href="https://www.facebook.com/profile.php?id=61583737525087&rdid=F2HnJvfUKyQx1leJ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CUPBrtmn8%2F#"
                      >
                          <img src={assets.facebook_icon} alt="" />
                      </a>

                      <a href="https://github.com/Sonali-04-Dutta">
                          <img src={assets.github_icon} alt="" className='github' />
                      </a>
                      
                      <a
                       href="https://www.linkedin.com/in/sonali-dutta-a127a1287/"   
                      >   
                      <img src={assets.linkedin_icon} alt="" />
                      </a>
                  </div>
              </div>
              <div className="footer-content-center"> 
                  <h2>COMPANY</h2>
                  <ul>
                      <li>Home</li>
                      <li>About Us</li>
                      <li>Delivery</li>
                      <li>Privacy policy</li>
                  </ul>
              </div>
              <div className="footer-content-right">
                  <h2>Get in touch</h2>
                  <ul>
                     <li> 📍Fultala 3no Gate,Baruipur, South 24 Parganas , India</li>
                     {/* <li>📞 Call / WhatsApp: +91 98765 43210  </li> */}
                     <li>✉️ veghomeflavour@gmail.com  </li>
                     <li>🕒 Mon–Sun | 10:00 AM – 10:00 PM</li>
                     
                  </ul>
              </div>
          </div>
          <hr />
          <p className='footer-copyright'> © 2025 VegHomeFlavour | Crafted with ❤️ for food lovers</p>
    </div>
  )
}

export default Footer
