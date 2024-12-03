import logo from '../assets/timePawa2.svg';
import '../assets/styles/dashboard css/dashboard.css';
import { Home, Timer, ArrowLeftRight, CalendarDays, LogOut, UserRound, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContex';
import { useState } from 'react';

const SideNavigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const { logout } = useSession();
    const location = useLocation();

    const path = location.pathname;

    const isActive = (route) => (path === route ? 'active' : '');

    return (
        <>
            <div className={`left-sidebar ${menuOpen ? 'mobile-open' : ''}`}>
                <div className="logo-sidebar">
                    <img src={logo} alt="timePawa logo" />
                </div>
                <div className="menu-sidebar">
                    <ul>
                        <li>
                            <a
                                href="/dashboard"
                                className={isActive('/dashboard')}
                            >
                                <Home size={20} color={isActive('/dashboard') ? "#B8FF29" : "#f6f6f6"} />
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/breaks"
                                className={isActive('/breaks')}
                            >
                                <Timer size={20} color={isActive('/breaks') ? "#B8FF29" : "#f6f6f6"} />
                                <span>My breaks</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/swaps"
                                className={isActive('/swaps')}
                            >
                                <ArrowLeftRight size={20} color={isActive('/swaps') ? "#B8FF29" : "#f6f6f6"} />
                                <span>Swaps</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/schedule"
                                className={isActive('/schedule')}
                            >
                                <CalendarDays size={20} color={isActive('/schedule') ? "#B8FF29" : "#f6f6f6"} />
                                <span>Schedule break</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/agents-on-break"
                                className={isActive('/agents-on-break')}
                            >
                                <UserRound size={20} color={isActive('/agents-on-break') ? "#B8FF29" : "#f6f6f6"} />
                                <span>Agents on break</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="logout">
                    <LogOut size={20} />
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
                <Menu size={20} />
            </button>
            {menuOpen && (
                <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
            )}
        </>
    );
};

export default SideNavigation;
