// import { useSession } from '../contexts/SessionContex'
import SideNavigation from '../components/SideNavigation';
import Header from '../components/Header';
import '../assets/styles/home css/home.css';
import { ArrowLeftRight, CircleCheckBig } from 'lucide-react';

const Homepage = () => {
  // const { user, logout } = useSession();

  return (

    <>
      <div>
        {/* <h1>Welcome {user?.username || "User"}</h1>
      <button onClick={logout}>Logout</button> */}
        <SideNavigation />
        <Header />
        <div className='all'>
          <div className='request-break'>
            <p>Request a break that suits your need</p>
            <button>Request a break</button>
          </div>
          <div className='upcoming-breaks'>
            <h2>Upcoming breaks</h2>
            <div className='day-break'>
              <div className='break1'>
                <p>Monday</p>
                <p>10:00am - 10:30am</p>
              </div>
              <div className='break2'>
                <p>Monday</p>
                <p>10:00am - 10:30am</p>
              </div>
              <div className='break3'>
                <p>Monday</p>
                <p>10:00am - 10:30am</p>
              </div>
            </div>
          </div>
          <h2 className='title-activity'>Activity</h2>
          <div className='activity'>
            <div className='activity1'>
              <ArrowLeftRight size={20} />
              <span>Muhirwa has requested for a swap.</span>
            </div>
            <div className='activity2'>
              <CircleCheckBig size={20} />
              <span>Your break has been approved.</span>
            </div>
            <div className='activity3'>
              <CircleCheckBig size={20} />
              <span>Muvunyi has approved your swap request.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Homepage