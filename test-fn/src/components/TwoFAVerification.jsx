import { useState } from 'react';
import '../assets/styles/login-css/login.css';
import Logo from '../assets/timePawa.svg';
import { verify2FA, reset2fa } from '../services/auth';

// eslint-disable-next-line react/prop-types
const TwoFAVerification = ({ onVerifySuccess, onResetSuccess }) => {
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");

    const handleTokenVerification = async (e) => {
        e.preventDefault();

        try {
            const response = await verify2FA(otp);

            console.log('Full Verification Response:', response);

            // Check response structure
            if (response && response.data) {
                onVerifySuccess(response.data);
            } else {
                setError("Verification failed: Unexpected response format");
            }
        } catch (error) {
            console.error("Verification Error Details:", {
                response: error.response,
                request: error.request,
                message: error.message
            });

            if (error.response) {
                // The request was made and the server responded with a status code
                console.log('Error Response Status:', error.response.status);
                console.log('Error Response Data:', error.response.data);

                switch (error.response.status) {
                    case 401:
                        setError("Unauthorized: Please log in again");
                        break;
                    case 404:
                        setError("Verification endpoint not found");
                        break;
                    case 400:
                        setError(error.response.data.message || "Invalid verification code");
                        break;
                    default:
                        setError(error.response.data.message || "Verification failed");
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError("No response received from server");
            } else {
                // Something happened in setting up the request
                setError("Error setting up verification request");
            }

            setOtp("");
        }
    }

    const handle2faReset = async (e) => {
        // Prevent default form submission behavior
        e.preventDefault();

        try {
            // Call reset2fa with the OTP
            const response = await reset2fa(otp);

            // Check if response has data
            if (response && response.data) {
                onResetSuccess(response.data);
            } else {
                setError("Reset failed");
            }
        } catch (error) {
            setOtp("");
            console.error("Error resetting 2FA:", error);
            setError(error.response?.data?.message || "Reset failed");
        }
    }

    return (
        <>
            <div className="logo">
                <img src={Logo} alt="TimePawa" />
            </div>
            <form className="container1">
                <div className="header">
                    <h1>Verify Two-Factor Authentication</h1>
                    <p>Enter the code from your authenticator app</p>
                </div>
                <div className='form'>
                    <input
                        type="text"
                        placeholder='Enter verification code'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="submit-div-setup" style={{ gap: "10px" }}>
                    <button type="button" onClick={handleTokenVerification}>Verify</button>
                    <button type="button" onClick={handle2faReset}>Reset</button>
                </div>
            </form>
        </>
    );
};

export default TwoFAVerification;