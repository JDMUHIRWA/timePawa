import { useState, useEffect } from 'react';
import '../assets/styles/AgentBreak/agentbreak.css';
import Header from '../components/Header';
import SideNavigation from '../components/SideNavigation';
import { fetchUsers } from '../services/auth';

const AgentsTable = () => {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredAgents, setFilteredAgents] = useState([]); // State for filtered agents

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await fetchUsers();
        setAgents(response.data);
        setFilteredAgents(response.data); // Initialize filtered agents
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgentData();
  }, []);

  // Update filtered agents when the search query changes
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = agents.filter((agent) =>
      agent.username.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredAgents(filtered);
  }, [searchQuery, agents]);

  return (
    <>
      <SideNavigation />
      <Header />
      <div className="agents-table-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for an agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="agents-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">Agents</th>
              <th className="table-header-cell">Screen Break 1</th>
              <th className="table-header-cell">Lunch Break</th>
              <th className="table-header-cell">Screen Break 2</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
              <tr key={agent._id} className={`table-row ${(agent._id % 2 === 0) ? 'even' : 'odd'}`}>
                <td className="table-cell">{agent.username}</td>
                <td className={`table-cell status-cell ${agent.screenBreak1 ? agent.screenBreak1.toLowerCase() : ''}`}>
                  {agent.screenBreak1 || 'N/A'}
                </td>
                <td className={`table-cell status-cell ${agent.lunchBreak ? agent.lunchBreak.toLowerCase() : ''}`}>
                  {agent.lunchBreak || 'N/A'}
                </td>
                <td className={`table-cell status-cell ${agent.screenBreak2 ? agent.screenBreak2.toLowerCase() : ''}`}>
                  {agent.screenBreak2 || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AgentsTable;