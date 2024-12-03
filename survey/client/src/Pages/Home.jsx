import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Home.css";
import mainImage from "../assets/Image1home.svg";

export default function Home() {
  return (
    <div className="home-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <Link to="/" id="navbar__logo">
          MUQuest
        </Link>
        <div className="navbar__menu">
          <div className="navbar__btn">
            <Link to="/login" className="button">
              {" "}
              Login/Sign Up{" "}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="main">
        <div className="main__container">
          <div className="main__content">
            <h1>MUQuest</h1>
            <h2>Questionnaire's</h2>
            <p>Create Your Custom Questionnaire Today!</p>
            <button className="main__btn">
              <Link to="/dashboard">Get Started</Link>
            </button>
          </div>
          <div className="main_img--container">
            <img src={mainImage} alt="pic" id="main__img" />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services">
        <h1>
          Discover How To Make Professional Level Questionnaires With Ease
        </h1>
        <div className="services__container">
          <div className="services__card">
            <h2>Experience a Stress Free Process</h2>
            <p>AI Powered Technology</p>
          </div>
          <div className="services__card">
            <h2>Are You Ready?</h2>
            <p>Take the Leap</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer__container">
        <div className="footer__links">
          <div className="footer__link--wrapper">
            <div className="footer__link--items">
              <h2>About Us</h2>
              <Link to="/">How It Works</Link>
              <Link to="/">Reviews</Link>
              <Link to="/">Behind The Scenes</Link>
              <Link to="/">Privacy Statement</Link>
              <Link to="/">Terms of Service</Link>
            </div>
            <div className="footer__link--items">
              <h2>Contact Us</h2>
              <Link to="/">Contact</Link>
              <Link to="/">Support</Link>
              <Link to="/">Sponsorships</Link>
            </div>
            <div className="footer__link--items">
              <h2>Social Media</h2>
              <Link to="/">Facebook</Link>
              <Link to="/">X</Link>
              <Link to="/">LinkedIn</Link>
              <Link to="/">YouTube</Link>
            </div>
          </div>
        </div>
        <div className="social__media">
          <div className="social__media--wrap">
            <div className="footer__logo">
              <Link to="/" id="footer__logo">
                <i className="fa-solid fa-cloud"></i>MUQuest
              </Link>
            </div>
            <p className="website__rights">
              © MUQuest 2024. All Rights Reserved
            </p>
            <div className="social__icons">
              <Link to="/" className="social__icon--link" target="_blank">
                <i className="fab fa-facebook"></i>
              </Link>
              <Link to="/" className="social__icon--link" target="_blank">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link to="/" className="social__icon--link" target="_blank">
                <i className="fab fa-linkedin"></i>
              </Link>
              <Link to="/" className="social__icon--link" target="_blank">
                <i className="fab fa-youtube"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
