
import logo from '../assets/timePawa2.svg'
import '../assets/styles/dashboard css/dashboard.css'
import { Home, Timer, ArrowLeftRight, CalendarDays, LogOut, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '../contexts/SessionContex'


const SideNavigation = () => {
    const [active, setActive] = useState('/dashboard')
    const { logout } = useSession();

    const handleActive = (path) => {
        setActive(path)
    };

    return (
        <>
            <div className='left-sidebar'>
                <div className='logo-sidebar'>
                    <img src={logo} alt="" />
                </div>
                <div className="menu-sidebar">
                    <ul>
                        <li>
                            <a href="/dashboard"
                                className={active === '/dashboard' ? 'active' : ''}
                                onClick={() => handleActive('/dashboard')
                                }
                            >
                                <Home size={20} color={active === "/dashboard" ? "#B8FF29" : "#f6f6f6"} />
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="/breaks"
                                className={active === '/breaks' ? 'active' : ''}
                                onClick={() => handleActive('/breaks')}>
                                <Timer size={20} color={active === "/breaks" ? "#B8FF29" : "#f6f6f6f6"} />
                                <span>My breaks</span>
                            </a>
                        </li>
                        <li>
                            <a href="/swaps"
                                className={active === '/swaps' ? 'active' : ''}
                                onClick={() => handleActive('/swaps')}>
                                <ArrowLeftRight size={20} color={active === "/swaps" ? "#B8FF29" : "#f6f6f6f6"} />
                                <span>Swaps</span>
                            </a>
                        </li>
                        <li>
                            <a href="/schedule"
                                className={active === '/schedule' ? 'active' : ''}
                                onClick={() => handleActive('/schedule')}>
                                <CalendarDays size={20} color={active === "/schedule" ? "#B8FF29" : "#f6f6f6f6"}
                                />
                                <span>Schedule break</span>
                            </a>
                        </li>
                        <li>
                            <a href="/agents-on-break"
                                className={active === '/agents-on-break' ? 'active' : ''}
                                onClick={() => handleActive('/agents-on-break')}>
                                <UserRound size={20} color={active === "/agents-on-break" ? "#B8FF29" : "#f6f6f6f6"} />
                                <span>Agents on break</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="logout">
                    <LogOut size={20} />
                    <button onClick={logout}>Logout</button>
                </div>
            </div >
        </>
    )
}

export default SideNavigation