import Logo from '../assets/timePawa.svg'
import { useState } from 'react'
import { loginUser, register } from '../services/auth'
import '../assets/styles/login-css/login.css'


// eslint-disable-next-line react/prop-types
const Loginform = ({ onLoginSuccess }) => {
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
                <div className="flex flex-row w-80 m-4 space-x-2 ">
                    <button
                        className={`w-full p-2 border border-[#d1d5cb] rounded-full text-center text-sm font-normal h-10  ${action === "Register" ? "bg-[#9ce800] text-white" : "bg-transparent"}`}
                        onClick={() => {
                            handleActionChange("Register");
                        }}
                    >
                        Register
                    </button>
                    <button
                        className={`w-full p-2 border border-[#d1d5cb] rounded-full text-center text-sm font-normal ${action === "Sign in" ? "bg-[#9ce800] text-white" : "bg-transparent"}`}
                        onClick={() => {
                            handleActionChange("Sign in");
                        }}
                    >
                        Sign in
                    </button>
                </div>

                <form onSubmit={action === "Register" ? handleRegister : handleLogin} className="w-[90%] rounded-md text-sm text-black">
                    {action === "Register" && (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-12 p-2 my-2 border border-green border-[#d7d7d7] rounded-md text-sm text-black focus:outline-none hover:border-[#9ce800]"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onClick={() => setMessage("")}
                                className="w-full h-12 p-2 my-2 border border-[#d7d7d7] hover:border-[#9ce800] rounded-md text-sm text-black focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 p-2 my-2 border border-[#d7d7d7] rounded-md text-sm text-black focus:outline-none hover:border-[#9ce800]"
                            />
                        </>
                    )}
                    {action === "Sign in" && (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onClick={() => { setMessage(""), setError("") }}
                                className="w-full h-12 p-2 my-2 border border-[#d7d7d7] rounded-md text-sm text-black focus:outline-none hover:border-[#9ce800]"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 p-2 my-2 border border-[#d7d7d7] rounded-md text-sm text-black focus:outline-none hover:border-[#9ce800]"
                            />
                        </>
                    )}
                    {action === "Sign in" && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border border-[#d7d7d7] rounded-md my-3"
                            />
                            <label className="text-sm">Remember Me</label>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <div className="flex justify-center mt-4 w-full">
                        <input
                            type="submit"
                            value={action === "Register" ? "Register" : "Sign In"}
                            className="w-2/4 h-10 p-2 bg[rgba(117, 11, 11, 0.0196078431)] rounded-full border border-gray-300 hover:bg-lime-400  focus:outline-none hover:text-white"
                        />
                    </div>
                </form>

            </div>
        </>
    )

}

export default Loginform;