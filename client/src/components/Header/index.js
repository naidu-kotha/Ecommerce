import React from "react";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./index.css";

function Header() {
  const navigate = useNavigate();

  const onClickLogOut = ()=>{
      Cookies.remove("jwt_token");
      Cookies.remove("userDetails");
      navigate("/login", { replace: true });
      
  }
  return (
    <Navbar collapseOnSelect expand="lg" className="home-bg-container">
      <Container>
        <Navbar.Brand className="h-heading-nav" href="/langingPage">
          NM-Trends
        </Navbar.Brand>
        <div>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="h-icon"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link className="h-routes" href="/products">
                Products
              </Nav.Link>
              <Nav.Link className="h-routes" href="/cart">
                cart
              </Nav.Link>
              <Nav.Link className="h-routes" href="/profile">
                profile
              </Nav.Link>
              <Nav.Link onClick={onClickLogOut} className="h-routes">
                logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
