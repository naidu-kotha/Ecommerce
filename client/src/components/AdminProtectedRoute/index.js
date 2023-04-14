import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AdminProtectedRoute = (props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = Cookies.get("role");
  const checkUserToken = () => {
    const userToken = Cookies.get("jwt_token");
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
      return navigate("/login");
    }
    setIsLoggedIn(true);
    if (isLoggedIn && role !== "admin") {
      return navigate("/");
    }
  };
  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);
  return (
    <React.Fragment>
      {isLoggedIn && role === "admin" ? props.children : null}
    </React.Fragment>
  );
};
export default AdminProtectedRoute;
