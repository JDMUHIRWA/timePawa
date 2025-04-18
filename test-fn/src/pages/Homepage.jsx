import {
  ArrowLeftRight,
  CircleCheckBig,
  Bell,
  Coffee,
  Clock,
  OctagonX,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideNavigation from '../components/SideNavigation';
import '../assets/styles/home css/home.css';
import { useSession } from '../contexts/SessionContex';
import { useState, useEffect } from 'react';
import { getBreakRequestsByInitiator, getTargetSwapRequests, getUserSwapRequests, deleteSwapRequest, deleteBreakRequest } from '../services/requests';
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
    navigate('/schedule');
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
      const swapRequestsbyUser = await getUserSwapRequests(user.username);
      const breakRequests = await getBreakRequestsByInitiator(user.username);

      const allNotifications = [...swapRequests, ...swapRequestsbyUser, ...breakRequests];
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
      if (data.target === user.username || data.initiator === user.username) {
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
      if (data.target === user.username) {
        // Notification for the target
        switch (data.status) {
          case 'PENDING':
            return `You have a swap request from ${data.initiator} waiting for approval.`;
          case 'APPROVED':
            return `The swap request from ${data.initiator} has been approved!`;
          case 'REJECTED':
            return `The swap request from ${data.initiator} has been declined.`;
          default:
            return 'No recent swap activity.';
        }
      } else if (data.initiator === user.username) {
        // Notification for the initiator
        switch (data.status) {
          case 'PENDING':
            return `Your swap request to ${data.target} is waiting for approval.`;
          case 'APPROVED':
            return `Your swap request to ${data.target} has been approved!`;
          case 'REJECTED':
            return `Your swap request to ${data.target} has been declined.`;
          default:
            return 'No recent swap activity.';
        }
      }
    } else if (data.requestType === 'SCHEDULE_BREAK') {
      // Break Request Notifications
      switch (data.status) {
        case 'PENDING':
          return `${data.initiator}, your ${data.type} break is waiting for approval.`;
        case 'APPROVED':
          return `${data.initiator}, your ${data.type} break has been approved!`;
        case 'REJECTED':
          return `${data.initiator}, your ${data.type} break has been declined.`;
        default:
          return 'No recent break request activity ✅.';
      }
    }

    return 'No recent activity.';
  };


  // filter notifications
  const tabsNotifications = notifications.filter(
    (notification) => notification.requestType === (activeTab === 'swaps' ? 'SWAP' : 'SCHEDULE_BREAK')
  );
  // delete notification 
  const deleteNotification = async (id) => {
    try {
      if (activeTab === 'swaps') {
        await deleteSwapRequest(id);
      } else if (activeTab === 'breaks') {
        await deleteBreakRequest(id);
      }
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification =>
          notification._id !== id
        )
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };


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
            <div className="mb-2 flex justify-between">
              <div className="flex items-center gap-4">
                <Bell className="section-icon" />
                <h2>Recent Activity</h2>
              </div>
              <div className=" flex border-b border-black-400 justify-end">
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
                    <div className='flex gap-4'>
                      <small className='text-sm text-gray-500'>{new Date(notification.createdAt).toLocaleString()}</small>
                      {(notification.status === 'APPROVED' || notification.status === 'REJECTED') && (
                        <Trash2
                          className='cursor-pointer'
                          onClick={() => deleteNotification(notification._id)}
                        />
                      )}
                    </div>
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