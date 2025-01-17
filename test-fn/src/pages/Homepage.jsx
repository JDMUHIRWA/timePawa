import {
  ArrowLeftRight,
  CircleCheckBig,
  Bell,
  Coffee,
  Clock,
  OctagonX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideNavigation from '../components/SideNavigation';
import '../assets/styles/home css/home.css';
import { useSession } from '../contexts/SessionContex';
import { useState, useEffect } from 'react';
import { getBreakRequestsByInitiator, getTargetSwapRequests } from '../services/requests';
import socket from '@/utils/socket';
// import { setupNotifications, sendNotification } from '@/utils/notifications';

const Homepage = () => {
  const navigate = useNavigate();
  const { role, user } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('swaps');

  const handleBreakRequest = () => {
    navigate('/schedule');
  }
  const handleScheduleApproval = () => {
    navigate('/schedules');
  }
  const handleSwapRequest = () => {
    navigate('/swaps');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNotifications = async () => {
    try {
      if (!user) {
        console.log('User not loaded yet');
        return;
      }
      const swapRequests = await getTargetSwapRequests(user.username);
      const breakRequest = await getBreakRequestsByInitiator(user.username);

      const allNotifications = [...swapRequests, ...breakRequest];
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    // listen for new swap notifications
    socket.on('receive-swap-notification', (data) => {
      console.log('Received data:', data);
      // only add the notification if the user is the target
      if (data.target === user.username) {
        setNotifications((prevNotifications) => prevNotifications.some((notif) => notif._id === data._id) ? prevNotifications : [...prevNotifications, data]);
      }
    });

    // Listen for new break request notifications
    socket.on('receive-new-break-request', (data) => {
      console.log('Break Request Notification Received:', data);
      if (data.initiator === user.username) {
        setNotifications((prevNotifications) =>
          prevNotifications.some((notif) => notif._id === data._id)
            ? prevNotifications
            : [...prevNotifications, data]
        );
      }
    });

    loadNotifications();

    return () => {
      socket.off('receive-swap-notification');
      socket.off('receive-new-break-request');
    }
  }, [user, loadNotifications]);

  const getNotificationMessage = (data) => {
    if (data.requestType === 'SWAP') {
      switch (data.status) {
        case 'PENDING':
          return `New swap request from ${data.initiator} waiting for approval`;
        case 'APPROVED':
          return `${data.target}, the swap request from ${data.initiator} has been approved!`;
        case 'REJECTED':
          return `${data.target}, the swap request from ${data.initiator} has been declined`;
        default:
          return 'No recent swap activity';
      }
    } else if (data.requestType === 'SCHEDULE_BREAK') {
      switch (data.status) {
        case 'PENDING':
          return `New break request from ${data.initiator} waiting for approval`;
        case 'APPROVED':
          return `${data.initiator}, your ${data.type} has been approved!`;
        case 'REJECTED':
          return `${data.initiator},your ${data.type} has been declined!`;
        default:
          return 'No recent break request activity ✅';
      }
    }
    return 'No recent activity';
  };

  // filter notifications
  const tabsNotifications = notifications.filter((notification) => {
    return activeTab === 'swaps' ? notification.requestType === 'SWAP' : notification.requestType === 'SCHEDULE_BREAK'
  });


  return (
    <>
      <SideNavigation />
      <Header />
      <div className="homepage-container">
        <div className="homepage-content">
          <div className="break-request-card">
            <div className="break-request-content">
              <div className="break-request-text">
                <Coffee className="break-icon" />
                <div>
                  <h3>{role === 'AGENT' ? 'Take a moment' : 'Manage Team Breaks'}</h3>
                  <p>{role === 'AGENT' ? 'Request a break that suits your needs' : 'Approve or Reject'}</p>
                </div>
              </div>
              {role === 'SUPERVISOR' ? (
                <div className='supervisor-button'>
                  <button
                    onClick={handleScheduleApproval}
                    aria-label="Request a break"
                    className="request-break-btn supervisor-button"
                  >
                    Schedule Approval
                  </button>
                  <button
                    onClick={handleSwapRequest}
                    aria-label="Request a break"
                    className="request-break-btn supervisor-button"
                  >
                    Swap Approval
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBreakRequest}
                  className="request-break-btn"
                  aria-label="Request a break"
                >
                  Request Break
                </button>
              )}
            </div>
          </div>

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

          <div className="activity-section">
            <div className="section-header mb-[0rem]">
              <Bell className="section-icon" />
              <h2>Recent Activity</h2>
            </div>
            <div className="mb-2 mt-0 flex border-b border-black-400 justify-end">
              <button
                onClick={() => setActiveTab('swaps')}
                className={`px-8 py-4 text-sm font-medium ${activeTab === 'swaps'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
                  }`}
              >
                Swaps
              </button>
              <button
                onClick={() => setActiveTab('breaks')}
                className={`px-8 py-4 text-sm font-medium ${activeTab === 'breaks'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 '
                  }`}
              >
                Breaks
              </button>
            </div>


            <div className="activity-list">
              {tabsNotifications.length > 0 ? (
                tabsNotifications.map((notification, index) => (
                  <div key={index} className="activity-item flex items-center justify-between gap-4">
                    <div className='flex items-center gap-4'>
                      {notification.status === 'PENDING' && (
                        <ArrowLeftRight className="activity-icon swap" />
                      )}
                      {notification.status === 'APPROVED' && (
                        <CircleCheckBig className="activity-icon approved" />
                      )}
                      {notification.status === 'REJECTED' && (
                        <OctagonX className="activity-icon verified" />
                      )}
                      <span className='flex items-center gap-4'>{getNotificationMessage(notification)}</span>
                    </div>
                    <small className='createdAt flex float-right text-sm text-gray-500 mt-2'>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p className='bg-[#F5F5F7] p-4 border rounded-lg'>{`Hello ${user.username} no recent Activity ✅`}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;