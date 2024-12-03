import {
  ArrowLeftRight,
  CircleCheckBig,
  Bell,
  Coffee,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideNavigation from '../components/SideNavigation';
import '../assets/styles/home css/home.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleBreakRequest = () => {
    navigate('/breaks');
  }

  return (
    <>
    <SideNavigation />
    <Header />
    <div className="homepage-container">
      <div className="homepage-content">
        {/* Break Request Section */}
        <div className="break-request-card">
          <div className="break-request-content">
            <div className="break-request-text">
              <Coffee className="break-icon" />
              <div>
                <h3>Take a Moment</h3>
                <p>Request a break that suits your needs</p>
              </div>
            </div>
            <button
              onClick={handleBreakRequest}
              className="request-break-btn"
            >
              Request Break
            </button>
          </div>
        </div>

        {/* Upcoming Breaks Section */}
        <div className="upcoming-breaks-section">
          <div className="section-header">
            <Clock className="section-icon" />
            <h2>Upcoming Breaks</h2>
          </div>
          <div className="breaks-grid">
            {[
              { day: 'Monday', time: '10:00am - 10:30am' },
              { day: 'Tuesday', time: '12:30pm - 1:00pm' },
              { day: 'Wednesday', time: '3:00pm - 3:30pm' }
            ].map((breakItem, index) => (
              <div key={index} className="break-card">
                <div className="breaks-day">{breakItem.day}</div>
                <div className="break-time">{breakItem.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div className="activity-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            {[
              {
                icon: <ArrowLeftRight className="activity-icon swap" />,
                text: "Muhirwa has requested a break swap"
              },
              {
                icon: <CircleCheckBig className="activity-icon approved" />,
                text: "Your break has been approved"
              },
              {
                icon: <CheckCircle className="activity-icon verified" />,
                text: "Muvunyi has approved your swap request"
              }
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                {activity.icon}
                <span>{activity.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Homepage;