import TwoFAVerification from "../components/TwoFAVerification"
import { useNavigate } from "react-router-dom";

const Verify2FA = () => {
  const navigate = useNavigate();

  const handleVerification = async (data) => {
    if (data) {
      navigate("/dashboard");
    }
  }
  const handle2faReset =  async(data) => {
    if (data) {
      navigate("/setup2fa");
    }
  }

  return (
    <div><TwoFAVerification onVerifySuccess={handleVerification} onResetSuccess={handle2faReset} /> </div>
  )
}

export default Verify2FA