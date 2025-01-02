import SideNavigation from '../components/SideNavigation';
import Header from '../components/Header';
import '../assets/styles/swap&break/swap.css';

const Schedule = () => {
  return (
    <>
      <SideNavigation />
      <Header />

      <div className="swap-container">
        <main className="content">
          <form className="break-form">
            <div className="form-group">
              <label htmlFor="time">Type</label>
              <select id="time">
                <option value="Coaching Session">Coaching Session</option>
                <option value="Training Session">Training Session</option>
                <option value="Meeting">Meeting</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Time</label>
              <input className="focus:outline-none" type="time" id="date" placeholder="DD/MM/YYYY" />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input className="focus:outline-none" type="text" id="date" placeholder="DD/MM/YYYY" />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <textarea className="focus:outline-none"  id="reason" placeholder="Type your reason"></textarea>
            </div>
            <div className='submit-button'><button type="submit" >Request a break</button></div>
          </form>
        </main>
      </div>

    </>
  )
}

export default Schedule