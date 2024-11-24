import React from "react";
import logo from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/timePawa.svg";
import "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/styles/welcome/welcome.css";

export const Welcome = () => {
  return (
    <>
      <div className="container">
        <div className="ellipse1"></div>
        <div className="ellipse2"></div>
        <div className="ellipse3"></div>
        <div className="top">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div>
            <button className="login">
              <a href="/login">Login</a>
            </button>
            <button className="register">
              <a href="/register">Register</a>
            </button>
          </div>
        </div>
        <div className="bottom">
          <div className="welcome">
            <h1>Ready to start your shift with ease</h1>
            <div className="button-div">
              <button className="button">
                <a href="/getstarted">Get Started</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
