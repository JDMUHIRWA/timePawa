import { User } from "lucide-react";
import "../assets/styles/header css/header.css";
import { useSession } from '../contexts/SessionContex'

const Header = () => {
    const { user } = useSession();
    return (
        <>
            <div className="container">
                <div className="left">
                    <h1> Welcome back, {user?.username || "User"}</h1>
                    <p>Here’s everything about today</p>
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