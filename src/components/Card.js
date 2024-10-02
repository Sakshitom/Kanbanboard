import React from "react";
import "./Card.css";
import high from "../assets/Img - High Priority.svg";
import medium from "../assets/Img - Medium Priority.svg";
import low from "../assets/Img - Low Priority.svg";
import urgent from "../assets/SVG - Urgent Priority grey.svg";
import pfp from "../assets/maxmaxmax.jpg";

const Card = ({ id, title, priority, user, status }) => {
  const icon =
    priority === 1
      ? low
      : priority === 2
      ? medium
      : priority === 3
      ? high
      : urgent;
  return (
    <div className="card">
      <p>{id}</p>
      <div>{title}</div>
      <div className="want">
        <img src={icon} alt="Priority" className="priority-badge" />
        <div className="feature-request">Feature Request</div>
      </div>

      <img src={pfp} alt="User Avatar" className="user-avatar" />
    </div>
  );
};

export default Card;
