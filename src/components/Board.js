import React, { useEffect } from "react";
import Card from "./Card";
import "./Board.css";
import add from "../assets/add.svg";
import dotmenu from "../assets/3 dot menu.svg";
import nopro from "../assets/No-priority.svg";
import high from "../assets/Img - High Priority.svg";
import medium from "../assets/Img - Medium Priority.svg";
import low from "../assets/Img - Low Priority.svg";
import urgent from "../assets/SVG - Urgent Priority colour.svg";
import todo from "../assets/To-do.svg";
import inprogress from "../assets/in-progress.svg";
import done from "../assets/Done.svg";
import backlog from "../assets/Backlog.svg";
import cancelled from "../assets/Cancelled.svg";

const Board = ({ tickets }) => {
  console.log(tickets);
  const getGroupIcon = (group) => {
    switch (group) {
      case "Todo":
        return todo;
      case "In progress":
        return inprogress;
      case "Done":
        return done;
      case "Backlog":
        return backlog;
      case "No Priority":
        return nopro;
      case "Low":
        return low;
      case "Medium":
        return medium;
      case "High":
        return high;
      case "Urgent":
        return urgent;
      case "Cancelled":
        return cancelled;

      default:
        return inprogress; // If no icon matches, return null
    }
  };
  const number = tickets.length;
  return (
    <div className="board">
      {Object.keys(tickets).map((group) => (
        <div key={group} className="column">
          <div className="head">
            <div className="heading">
              <img src={getGroupIcon(group)} className="group-icon" />
              <div>{group}</div>{" "}
              <div className="ticket-count">{tickets[group].length}</div>
            </div>
            <div className="menu">
              <img src={add} alt="Add" />
              <img src={dotmenu} alt="Menu" />{" "}
            </div>
          </div>
          {tickets[group].map((ticket) => (
            <Card key={ticket.id} {...ticket} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
