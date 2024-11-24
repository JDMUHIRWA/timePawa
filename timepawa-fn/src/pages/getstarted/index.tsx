import "./style.css";
import Logo from "../../components/assets/timePawa.svg";
import React, { useState } from "react";

export const Started = () => {
  const [action, setAction] = useState("Register");
  return (
    <>
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>
      <div className="container1">
        <div className="header">
          <h1>Welcome to timePawa</h1>
          {/* <p>Choose Register or Sign in</p> */}
        </div>
        <div className="display">
          {action === "Register" ? "Create an account" : ""}
        </div>
        <div className="display">
          {action === "Sign in" ? "Sign in to your account" : ""}
        </div>
        <div className="buttons">
          <button
            className={`button ${action === "Register" ? "active" : ""}`}
            onClick={() => {
              setAction("Register");
            }}
          >
            Register
          </button>
          <button
            className={`button ${action === "Sign in" ? "active" : ""}`}
            onClick={() => {
              setAction("Sign in");
            }}
          >
            Sign in
          </button>
        </div>

        <form action="Submit" className="form">
          {action === "Register" ? (
            <>
              <input type="text" placeholder="Username" />
              <input type="text" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <input type="password" placeholder="Confirm Password" />
            </>
          ) : (
            ""
          )}
          {action === "Sign in" ? (
            <>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
            </>
          ) : (
            ""
          )}
          {action === "Register" ? (
            <div></div>
          ) : (
            <div className="checkbox">
              <input type="checkbox" className="checkbox-input" />
              <label>Remember Me</label>
            </div>
          )}
          <div className="submit-div">
            <input
              type="submit"
              placeholder="Sign In"
              className="submit-input"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Started;
