import { useState, useEffect } from "react";
import { fetchUsers } from "../services/auth"; // Import your fetchUsers function
import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import "../assets/styles/swap&break/swap.css";
import { User, CalendarDays, NotebookPen, Timer } from 'lucide-react';

const Swaps = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

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

  const handleSubmit = (e) => {
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

    console.log("Form submitted:", formData);
    // Send formData to backend or process it further
  };

  return (
    <>
      <SideNavigation />
      <Header />
      <div className="swap-container">
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
                <label htmlFor="agent">From</label>
              </div>
              <input type="time" id="from" name="from" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <Timer size={24} />
                <label htmlFor="agent">To</label>
              </div>
              <input type="time" id="to" name="to" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <CalendarDays size={24} />
                <label htmlFor="agent">Date</label>
              </div>
              <input type="text" id="date" name="date" placeholder="DD/MM/YYYY" />
            </div>
            <div className="form-group">
              <div className="swap-icon">
                <NotebookPen size={24} />
                <label htmlFor="agent">Reason</label>
              </div>
              <textarea id="reason" name="reason" placeholder="Type your reason"></textarea>
            </div>
            <div className="submit-button">
              <button type="submit">Request a break</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Swaps;