import { useState, useEffect } from "react";
import { fetchUsers } from "../services/auth"; // Import your fetchUsers function
import { swapRequest } from "../services/requests"; // Import your swapRequest function
import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import "../assets/styles/swap&break/swap.css";
import { User, CalendarDays, NotebookPen, Timer } from 'lucide-react';
import MyTable from "../components/Table";
import { useSession } from "../contexts/SessionContex";
import socket from "@/utils/socket";

const Swaps = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const { role, user } = useSession();

  // Fetch users from the backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data); // Store users in state
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    loadUsers();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(searchValue))
    );
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user.username); // Store selected user's username
    setSearchTerm(user.username); // Show selected user in input
    setFilteredUsers([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Extract form values
    const fromTime = event.target.from.value; // e.g., "15:00"
    const toTime = event.target.to.value; // e.g., "15:40"
    const inputDate = event.target.date.value; // e.g., "21/01/2025"

    // Parse the `date` and combine with `from` and `to` times
    const [day, month, year] = inputDate.split("/"); // Split the date string
    const date = new Date(`${year}-${month}-${day}`); // Convert to Date object

    const from = new Date(date); // Clone the date object
    const [fromHours, fromMinutes] = fromTime.split(":"); // Split the time
    from.setHours(fromHours, fromMinutes); // Set time on the date object

    const to = new Date(date); // Clone the date object
    const [toHours, toMinutes] = toTime.split(":");
    to.setHours(toHours, toMinutes);

    // Create the payload
    const swapData = {
      initiator: user.username,
      target: selectedUser,
      from: from.toISOString(),
      to : to.toISOString(),
      date: date.toISOString(),
      reason: event.target.reason.value,
    };

    try {
      // Call the API to create a new swap request
      const response = await swapRequest(swapData);
      console.log(response);
      alert("Swap request successfully created!");
      // Emit a socket event to notify the target user and the supervisor
      socket.emit("swap-notification", swapData)
    } catch (error) {
      console.error("Failed to create swap request:", error.response?.data || error);
      alert("Failed to create swap request. Please try again.");
    }

    // Clear the form after submission
    event.target.reset();
    setSelectedUser("");
    setSearchTerm("");
  };


  return (
    <>
      <SideNavigation />
      <Header />
      {role === "SUPERVISOR" ? (<MyTable />) : (<div className="swap-container">
        <main className="content">
          <form className="break-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="swap-icon">
                <User size={24} />
                <label htmlFor="agent">Agent</label>
              </div>
              <div className="search-container">
                <input
                  type="text"
                  id="agent"
                  placeholder="Search Agent"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setFilteredUsers(users)}
                  className="focus:outline-none"
                  autoComplete="off"
                />
                {filteredUsers.length > 0 && (
                  <div className="dropdown">
                    {filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleSelectUser(user)}
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="swap-icon">
                <Timer size={24} />
                <label htmlFor="from">From</label>
              </div>
              <input type="time" id="from" name="from" className="focus:outline-none" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <Timer size={24} />
                <label htmlFor="to">To</label>
              </div>
              <input type="time" id="to" name="to" className="focus:outline-none" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <CalendarDays size={24} />
                <label htmlFor="date">Date</label>
              </div>
              <input className="focus:outline-none" type="text" id="date" name="date" placeholder="DD/MM/YYYY" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <NotebookPen size={24} />
                <label htmlFor="reason">Reason</label>
              </div>
              <textarea className="focus:outline-none" id="reason" name="reason" placeholder="Type your reason"></textarea>
            </div>
            <div className="submit-button">
              <button type="submit">Request a break</button>
            </div>
          </form>
        </main>
      </div>)}
    </>
  );
};

export default Swaps;