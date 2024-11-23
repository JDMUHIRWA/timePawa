import logo from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/timePawa.svg";
import background from "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/assets/login-back.png";
import "/Users/muhirwa/Desktop/projects/timePawa/timepawa-fn/src/components/styles/login css/login.css";

export const Register = () => {
  return (
    <>
      <div className="container">
        <div className="left">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="Login-form">
            <h1>Create an account</h1>
            <p>Enter your credentials to sign in</p>
            <form action="Submit" className="form-login">
              <input type="text" placeholder="Username" />
              <input type="text" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <div className="submit-div">
                <input
                  placeholder="Register"
                  className="submit-input"
                />
              </div>
            </form>
            <div className="span">
              <p>
                Already have an account? <a href="/login">Sign In</a>
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

export default Register;
