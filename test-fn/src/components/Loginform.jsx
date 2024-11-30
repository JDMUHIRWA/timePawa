import Logo from '../assets/timePawa.svg'
import '../assets/styles/login-css/login.css'
import { useState } from 'react'
import { loginUser, register } from '../services/auth'


// eslint-disable-next-line react/prop-types
const Loginform = ({onLoginSuccess}) => {
    const [action, setAction] = useState("Sign in");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        //client side validation
        if (username.length === 0) {
            setError("Username is required");
            return;
        }
        if (password.length === 0) {
            setError("Password is required");
            return;
        }
        try {
            const { data } = await loginUser(username, password);
            setMessage(data.message);
            localStorage.setItem('token', data.token);
            setUsername("");
            setPassword("");
            setError("");
            
            if (onLoginSuccess) { onLoginSuccess(data); }

        } catch (error) {
            console.log("The error is: ", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Invalid username or password");
            setMessage("");
        }

    }
    const handleRegister = async (e) => {
        e.preventDefault();

        // Client side validation
        if (username < 3) {
            setError("Username must be at least 3 characters");
            return;
        }
        if (password < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const { data } = await register(username, password);
            setMessage(data.message);

            // Reset form fields after successful registration
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setError("");
            setAction("Sign in");  // Automatically switch to sign in view


        } catch (error) {
            console.log("The error is: ", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Something went wrong during registration");
            setMessage("");
        }
    }
    const handleActionChange = async (newAction) => {
        if (action !== newAction) {
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setError("");
            setMessage("");
        }
        setAction(newAction);
    }
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
                            handleActionChange("Register");
                        }}
                    >
                        Register
                    </button>
                    <button
                        className={`button ${action === "Sign in" ? "active" : ""}`}
                        onClick={() => {
                            handleActionChange("Sign in");
                        }}
                    >
                        Sign in
                    </button>
                </div>

                <form onSubmit={action === "Register" ? handleRegister : handleLogin} className="form">
                    {action === "Register" ? (
                        <>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                                onClick={() => { setMessage("") }} />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </>
                    ) : (
                        ""
                    )}
                    {action === "Sign in" ? (
                        <>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                                onClick={() => { setMessage(""), setError("") }} />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {message && <p style={{ color: "green" }}>{message}</p>}
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
    )

}

export default Loginform;