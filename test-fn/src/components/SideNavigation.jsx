import logo from '../assets/timePawa2.svg';
import '../assets/styles/dashboard css/dashboard.css';
import { Home, Timer, ArrowLeftRight, CalendarDays, LogOut, UserRound, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContex';
import { useState } from 'react';

const SideNavigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const { role } = useSession();

    const { logout } = useSession();
    const location = useLocation();

    const path = location.pathname;

    const isActive = (route) => (path === route ? 'active' : '');

    const menuItems = [
        {
            path: '/dashboard',
            icon: Home,
            label: 'Home',
        },
        {
            path: '/breaks',
            icon: Timer,
            label: 'My breaks',
        },
        {
            path: '/swaps',
            icon: ArrowLeftRight,
            label: role === 'AGENT' ? 'Swaps' : 'Swap Requests',
        },
        {
            path: '/schedule',
            icon: CalendarDays,
            label: role === 'AGENT' ? 'Schedule break' : 'Schedule Approval',
        },
        {
            path: '/agents-on-break',
            icon: UserRound,
            label: role === 'AGENT' ? 'Agents on break' : 'Team Overview',
        },
    ];

    return (
        <>
            <div className={`left-sidebar ${menuOpen ? 'mobile-open' : ''}`}>
                <div className="logo-sidebar">
                    <img src={logo} alt="timePawa logo" />
                </div>
                <div className="menu-sidebar">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <a href={item.path} className={isActive(item.path)}>
                                    <item.icon size={20} color={isActive(item.path) ? "#B8FF29" : "#f6f6f6"} />
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
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
