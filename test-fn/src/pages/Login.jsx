import Loginform from "../components/Loginform";
import { useSession } from "../contexts/SessionContex";
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const navigate = useNavigate();
  const { login } = useSession();

  const handleLoginSuccess = (userData) => {
    console.log("userData", userData);
    login(userData);
    if (!userData.isMfaActive) {
      navigate("/setup2fa");
    } else {
      navigate("/verify2fa");
    }
  };

  return (
    <Loginform onLoginSuccess={handleLoginSuccess} />
  );
};

export default Test;