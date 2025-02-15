import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import './css/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage-container">
      <Header />
      <main className="homepage-main">
        <h2 className="homepage-subtitle">Your Ultimate Mobility Solution</h2>
        <div className="cards-container">
          <div className="card card-parkings" onClick={() => navigateTo('/parkings')}>
            <h2 className="card-title">Parkings</h2>
            <p className="card-description">Find and book parking spots.</p>
          </div>
          <div className="card card-rides" onClick={() => navigateTo('/rides')}>
            <h2 className="card-title">Rides</h2>
            <p className="card-description">Find and book rides.</p>
          </div>
        </div>
        <h2 className="homepage-subtitle">Our Services</h2>
        <div className="services-container">
          <div className="card service-card">
            <h2 className="card-title">Parking Reservations</h2>
            <p className="card-description">Reserve your parking spot in advance and avoid the hassle.</p>
          </div>
          <div className="card service-card">
            <h2 className="card-title">Easy Refunds and Cancellations</h2>
            <p className="card-description">Get easy refunds and cancellations for your bookings.</p>
          </div>
          <div className="card service-card">
            <h2 className="card-title">Shuttle/Taxi Booking</h2>
            <p className="card-description">Book shuttles and taxis for convenient travel.</p>
          </div>
        </div>
      </main>
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>About Us</h2>
            <p>PARKnRIDE is your ultimate mobility solution, providing easy access to parking spots and rides.</p>
          </div>
          <div className="footer-section contact">
            <h2>Contact Us</h2>
            <p>Email: contact@parknride.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
          <div className="footer-section careers">
            <h2>Careers</h2>
            <p>Join our team! <a href="/careers">View Open Positions</a></p>
          </div>
          <div className="footer-section address">
            <h2>Address</h2>
            <p>123 Mobility Lane, Transport City, TX 12345</p>
          </div>
          <div className="footer-section social">
            <h2>Follow Us</h2>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 PARKnRIDE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;