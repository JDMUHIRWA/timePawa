import { User } from "lucide-react";
import "../assets/styles/header css/header.css";
import { useSession } from '../contexts/SessionContex'
import { useLocation } from "react-router-dom";

const Header = () => {
    const { user } = useSession();
    const location = useLocation();

    const title = (path) => {
        switch (path) {
            case "/dashboard":
                return `Welcome back, ${user?.username || "User"}`;
            case "/breaks":
                return 'Manage Your Breaks'
            case "/swaps":
                return 'Request a Swap'
            case "/schedule":
                return 'Request a Schedule'
                case "/agents-on-break":
                return 'Agents on Break'
            default:
                return `Welcome back, ${user?.username || "User"}`; 
        }
    }
    return (
        <>
            <div className="container">
                <div className="left">
                    <h1>{title(location.pathname)}</h1>

                    {/* { location.pathname === "/dashboard" && <p>Get ready to kickoff your shift</p>} */}
                </div>
                <div className="right">
                    <div className="profile">
                        <User size={30} color="black" />
                        <span>{user?.username || "User"}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Header