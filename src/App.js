import React, { useState, useEffect } from "react";
import groupsData from "./groups.json";
import "./App.css";

const App = () => {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState({
    privacy: "all",
    color: "any",
    friends: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = {
        result: 1,
        data: groupsData,
      };

      if (response.result === 1) {
        setGroups(response.data);
      } else {
        console.error("Ошибка получения данных");
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value, type } = event.target;

    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: type === "checkbox" ? !prevFilter[name] : value,
    }));
  };

  const filteredGroups = groups.filter((group) => {
    if (
      filter.privacy !== "all" &&
      ((filter.privacy === "closed" && !group.closed) ||
        (filter.privacy === "open" && group.closed))
    ) {
      return false;
    }

    if (filter.color !== "any" && group.avatar_color !== filter.color) {
      return false;
    }

    if (filter.friends && (!group.friends || group.friends.length === 0)) {
      return false;
    }

    return true;
  });

  return (
    <div className="app">
      <div className="header">
        <div className="container">
          <div className="sidebar">
            <h2>Filter</h2>
            <ul>
              <li>
                <label>
                  Privacy:
                  <select
                    name="privacy"
                    value={filter.privacy}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="closed">Closed</option>
                    <option value="open">Open</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  Avatar color:
                  <select
                    name="color"
                    value={filter.color}
                    onChange={handleFilterChange}
                  >
                    <option value="any">Any</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  Has friends:
                  <input
                    type="checkbox"
                    name="friends"
                    checked={filter.friends}
                    onChange={handleFilterChange}
                  />
                </label>
              </li>
            </ul>
          </div>
          {filteredGroups.map((group) => (
            <div key={group.id}>
              <h3>{group.name}</h3>
              {group.avatar_color && (
                <div
                  className="label"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: group.avatar_color,
                  }}
                ></div>
              )}
              <p>Status: {group.closed ? "Closed" : "Open"}</p>
              <p>Members: {group.members_count}</p>
              {group.friends && (
                <>
                  <p onClick={() => alert("Show friends")}>
                    Friends: {group.friends.length}
                  </p>
                  {filter.friends && (
                    <ul>
                      {group.friends.map((friend) => (
                        <li
                          key={`${friend.first_name}-${friend.last_name}`}
                        >{`${friend.first_name} ${friend.last_name}`}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="footer"></div>
      </div>
    </div>
  );
};

export default App;
