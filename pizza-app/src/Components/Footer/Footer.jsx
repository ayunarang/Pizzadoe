import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer id="footer"><div className="footer-container">
      <div className="footer-content">
    
        <div className="footer-links">
         <ul class="footer-columns">
            <li class="column-title">Services</li>
            <li>Home Delivery</li>
            <li>Custom pizzas</li>
            <li>Takeout</li>
         </ul>
         <ul class="footer-columns">
         <li class="column-title">Locate</li>
            <li>Awesome City, US</li>
            <li>Anywhere Street</li>
            <li>This Lane</li>
         </ul>
         <ul class="footer-columns">
         <li class="column-title">Contact</li>
            <li>(123) 456-7890</li>
            <li>pizzadoe@gmail.com</li>
         </ul>
        </div>
        <div className="signup">
            <a href="/createuser"><p>Sign Up to get 10% off your first order</p></a>
            <div className="signup-input">
                <input placeholder='Your Email Address'></input>
                <button>Subscribe</button>
            </div>
        </div>
      </div>
      </div>
      <div className="footer-bottom">
        <p class="copyright">&copy; 2023 Ayushi Narang. All Rights Reserved.</p>
        <div class="terms">
            <p>Terms and Conditions</p>
            <p>Privacy Policy</p>
            <p>Do not sell my Information</p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
