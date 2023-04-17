import React, { useEffect, useState } from "react";
import Header from "../Header";
import "./index.css";
import axios from "axios";
import Cookies from "js-cookie";

function Users() {
  const [usersList, setUsersList] = useState([]);

  const jwtToken = Cookies.get("jwt_token");

  useEffect(() => {
    axios
      .get("/getusers/", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        setUsersList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setUsersList]);

  return (
    <>
      <Header />
      <div className="users-bg">
        <h1 className="users-heading">Users</h1>
        <ul className="users-container">
          {usersList.map((eachUser) => (
            <li key={eachUser.id} className="user-details-container">
              <p className="users-page-details">
                <b>Username:</b> {eachUser.username}
              </p>
              <p className="users-page-details">
                <b>Fullname:</b> {eachUser.fullname}
              </p>
              <p className="users-page-details">
                <b>Email:</b> {eachUser.email}
              </p>
              <p className="users-page-details">
                <b>Mobile:</b> {eachUser.mobile}
              </p>
              <p className="users-page-details">
                <b>Role:</b> {eachUser.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Users;
