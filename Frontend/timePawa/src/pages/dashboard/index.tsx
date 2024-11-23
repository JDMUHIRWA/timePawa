import React from 'react'
import logo from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/timePawa2.svg";
import "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/styles/dashboard css/dashboard.css";

export const Dashboard = () => {
  return (
    <>
      <div className="left-sidebar">
        <div className="sidebar">
          <div className="logo-sidebar">
            <img src={logo} alt="logo" />
          </div>
          <div className="menu-sidebar">
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                marginTop: "20px",
              }}
            >
              <li>
                <a href="/dashboard" className="active">
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/dashboard">
                  <i className="fas fa-user"></i>
                  <span>My breaks</span>
                </a>
              </li>
              <li>
                <a href="/dashboard">
                  <i className="fas fa-cog"></i>
                  <span>Swaps</span>
                </a>
              </li>
              <li>
                <a href="/dashboard">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Schedule break</span>
                </a>
              </li>
              <li>
                <a href="/dashboard">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Agents on break</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="right"></div>
    </>
  );
}

export default Dashboard