import { useEffect, useState } from 'react';
import '../assets/styles/login-css/login.css';
import Logo from '../assets/timePawa.svg';
import { setup2FA } from '../services/auth';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const TwoFASetup = ({ onSetupComplete }) => {
    const [method, setMethod] = useState("App");
    const [message, setMessage] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchQRCode = async () => {
        try {
            setIsLoading(true);
            const response = await setup2FA();
            console.log("Full Response:", response);

            // Check if response has data property or is directly the data
            const data = response.data || response;

            if (data && data.qrcode) {
                setQrCode(data.qrcode);
                setSecret(data.secret);
                console.log("QR Code Set:", data.qrcode);
                console.log("Secret Set:", data.secret);
            } else {
                setError("No QR code or secret found in response");
                console.error("Unexpected response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching QR code:", error);
            setError("Failed to fetch QR code");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchQRCode();
    }, []);

    const copyClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(secret);
            setMessage("Secret Copied to clipboard");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }
    const handleSetup = () => {
        navigate("/verify2fa");
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="logo">
                <img src={Logo} alt="logo" />
            </div>
            <div className="container1">
                <div className="header">
                    {/* <h1>Set up Two-Factor Authentication</h1> */}
                    {/* <p>Enhance your account security</p> */}
                </div>

                <div className="buttons">
                    <button
                        className={`button active`}
                        onClick={() => { setMethod("App") }} style={{ fontSize: "1rem" }}
                    >
                        Authenticator App
                    </button>
                </div>

                {method === "App" && (
                    <div className="qrcode-container">
                        <p>Scan this QR code with your authenticator app:</p>
                        {qrCode ? (
                            <img
                                src={qrCode}
                                alt="QR Code"
                            />
                        ) : (
                            <p>Unable to generate QR code</p>
                        )}

                        <div className="secret-container">
                            <p>Your Secret Key:</p>
                            <input
                                type="text"
                                readOnly
                                value={secret || ''}
                                onClick={copyClipBoard}
                            />
                            {message && <p style={{ color: "green" }}>{message}</p>}
                        </div>
                    </div>
                )}

                <div className="form" onSubmit={(e) => {
                    e.preventDefault();
                    onSetupComplete();
                    }}>
                </div>
                <div className="submit-div-setup">
                    <button onClick={handleSetup}>Next</button>
                    </div>
            </div>
        </>
    );
};

export default TwoFASetup;