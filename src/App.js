import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import "./App.css";
import arrow from "./assets/down.svg";
import display from "./assets/Display.svg";

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(
    localStorage.getItem("groupBy") || "status" // Retrieve from localStorage or default to "status"
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "priority" // Retrieve from localStorage or default to "priority"
  );
  const [dropdown, setDropdown] = useState(false);

  // Get the data from the API
  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        // Ensure we are fetching the array of tickets and users
        if (data.tickets && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          console.error("Expected tickets array but got:", data);
        }

        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("Expected users array but got:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Helper function to map user IDs to user names
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getUserAvailability = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? (user.available ? "Available" : "Unavailable") : "Unknown";
  };

  // Save selected grouping and sorting to localStorage
  const handleGroupByChange = (value) => {
    setGroupBy(value);
    localStorage.setItem("groupBy", value); // Save to localStorage
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    localStorage.setItem("sortBy", value); // Save to localStorage
  };

  // Grouping Logic
  const groupByStatus = (tickets) => {
    const groupedTickets = {
      Backlog: [],
      Todo: [],
      "In progress": [],
      Done: [],
      Cancelled: [],
    };

    tickets.forEach((ticket) => {
      let statusLabel;
      switch (ticket.status) {
        case "Backlog":
          statusLabel = "Backlog";
          break;
        case "Todo":
          statusLabel = "Todo";
          break;
        case "In progress":
          statusLabel = "In progress";
          break;
        case "Done":
          statusLabel = "Done";
          break;
        case "Cancelled":
          statusLabel = "Cancelled";
          break;
        default:
          statusLabel = "Backlog";
          break;
      }
      groupedTickets[statusLabel].push(ticket);
    });

    return groupedTickets;
  };

  const groupByUser = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const userName = getUserName(ticket.userId);
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(ticket);
      return acc;
    }, {});
  };

  const groupByPriority = (tickets) => {
    const groupedTickets = {
      "No Priority": [],
      Urgent: [],
      High: [],
      Medium: [],
      Low: [],
    };

    tickets.forEach((ticket) => {
      let priorityLabel;
      switch (ticket.priority) {
        case 0:
          priorityLabel = "No Priority";
          break;
        case 1:
          priorityLabel = "Low";
          break;
        case 2:
          priorityLabel = "Medium";
          break;
        case 3:
          priorityLabel = "High";
          break;
        case 4:
          priorityLabel = "Urgent";
          break;
        default:
          priorityLabel = "No Priority";
          break;
      }
      groupedTickets[priorityLabel].push(ticket);
    });

    return groupedTickets;
  };

  const groupedTickets =
    groupBy === "status"
      ? groupByStatus(tickets)
      : groupBy === "user"
      ? groupByUser(tickets)
      : groupByPriority(tickets);

  // Sorting Logic
  const sortTickets = (tickets, sortBy) => {
    if (sortBy === "priority") {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === "title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const sortedTickets = {};
  Object.keys(groupedTickets).forEach((key) => {
    sortedTickets[key] = sortTickets(groupedTickets[key], sortBy);
  });

  return (
    <div className="App">
      <header>
        <div className="controls">
          <header>
            <div className="controls">
              <div className="dropdown" onClick={() => setDropdown(!dropdown)}>
                <img src={display} alt="Display" />
                <div>Display</div>
                <img
                  src={arrow}
                  alt="Arrow"
                  className={`arrow ${dropdown ? "up" : "down"}`}
                />
              </div>
              {dropdown && (
                <div className="dropdown-content">
                  <div className="dropdown-item">
                    Grouping
                    <select
                      value={groupBy}
                      onChange={(e) => {
                        handleGroupByChange(e.target.value); // Save to localStorage
                        setDropdown(false);
                      }}
                    >
                      <option value="status">Status</option>
                      <option value="user">User</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                  <div className="dropdown-item">
                    Ordering
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        handleSortByChange(e.target.value); // Save to localStorage
                        setDropdown(false);
                      }}
                    >
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </header>
        </div>
      </header>
      <Board
        tickets={sortedTickets}
        getUserAvailability={getUserAvailability}
      />
    </div>
  );
}

export default App;
