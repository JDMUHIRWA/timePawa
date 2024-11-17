import logo from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/timePawa.svg";
import background from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/login-back.png";
import "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/styles/login css/login.css";

export const Login = () => {
  return (
    <>
      <div className="container">
        <div className="left">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="Login-form">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to sign in</p>
            <form action="Submit" className="form-login">
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
              <div className="checkbox">
                <input type="checkbox" className="checkbox-input" />
                <label>Remember Me</label>
              </div>
              <div className="submit-div">
                <input
                  type="submit"
                  placeholder="Sign In"
                  className="submit-input"
                />
              </div>
            </form>
            <div className="span">
              <p>
                Don't have an account? <span>Sign Up</span>{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="right">
          <img src={background} alt="" className="image-back" />
        </div>
      </div>
    </>
  );
};

export default Login;
