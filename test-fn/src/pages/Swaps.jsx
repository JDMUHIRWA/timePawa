import { useState, useEffect } from "react";
import { fetchUsers } from "../services/auth"; // Import your fetchUsers function
import { swapRequest } from "../services/requests"; // Import your swapRequest function
import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import "../assets/styles/swap&break/swap.css";
import { User, CalendarDays, NotebookPen, Timer } from 'lucide-react';
import MyTable from "../components/Table";
import { useSession } from "../contexts/SessionContex";

const Swaps = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const { role } = useSession();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Please select an agent before submitting!");
      return;
    }

    const formData = {
      agent: selectedUser,
      from: e.target.from.value,
      to: e.target.to.value,
      date: e.target.date.value,
      reason: e.target.reason.value,
    };

    try {
      const response = await swapRequest(formData);
      alert("Request submitted successfully!");
      e.target.reset();
      setSelectedUser("");
      setSearchTerm("");
      console.log("Request submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting request:", error.message);
    }
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
              <input type="time" id="from" name="from" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <Timer size={24} />
                <label htmlFor="to">To</label>
              </div>
              <input type="time" id="to" name="to" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <CalendarDays size={24} />
                <label htmlFor="date">Date</label>
              </div>
              <input type="text" id="date" name="date" placeholder="DD/MM/YYYY" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <NotebookPen size={24} />
                <label htmlFor="reason">Reason</label>
              </div>
              <textarea id="reason" name="reason" placeholder="Type your reason"></textarea>
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