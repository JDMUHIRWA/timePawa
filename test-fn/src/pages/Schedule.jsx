import SideNavigation from '../components/SideNavigation';
import Header from '../components/Header';
import '../assets/styles/swap&break/swap.css';
import { breakRequest } from '../services/requests';
import { useSession } from "../contexts/SessionContex";
import MyTable from "../components/scheduleTable";
import socket from '@/utils/socket';

const Schedule = () => {
  const { user, role } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Extract form values
    const type = event.target.type.value;
    const inputTime = event.target.time.value; // HH:mm format
    const inputDate = event.target.date.value; // YYYY-MM-DD format
    const reason = event.target.reason.value;

    // Combine date and time into a single ISO 8601 string
    const dateTime = new Date(`${inputDate}T${inputTime}:00Z`);

    // Check for invalid date
    if (isNaN(dateTime.getTime())) {
      alert("Invalid date or time. Please check your input.");
      return;
    }

    // Create the break request payload
    const breakData = {
      initiator: user.username,
      type,
      time: dateTime.toISOString(),
      date: inputDate, // Keep date as string (optional if you don't need it separately)
      reason,
    };

    try {
      const response = await breakRequest(breakData);
      console.log("Break data", response);
      alert("Break request successfully created!");
      socket.emit("new-break-request", response);
    } catch (error) {
      console.error("Failed to create break request:", error.response?.data || error);
      alert(`Failed to create break request: ${error.response?.data?.message || error.message}`);
    }

    // Clear the form after submission
    event.target.reset();
  };


  return (
    <>
      <SideNavigation />
      <Header />
      {role === "SUPERVISOR" ? (<MyTable />) : (
        <div className="swap-container">
          <main className="content">
            <form className="break-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select id="type" defaultValue="COACHING">
                  <option value="COACHING">Coaching Session</option>
                  <option value="TRAINING">Training Session</option>
                  <option value="MEETING">Meeting</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  className="focus:outline-none"
                  type="time"
                  id="time"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  className="focus:outline-none"
                  type="date"
                  id="date"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  className="focus:outline-none"
                  id="reason"
                  placeholder="Type your reason"
                  required
                ></textarea>
              </div>
              <div className="submit-button">
                <button type="submit">Request a break</button>
              </div>
            </form>
          </main>
        </div>
      )}

    </>
  );
};

export default Schedule;
