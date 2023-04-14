import React from "react";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./index.css";

function Header() {
  const navigate = useNavigate();
  const role = Cookies.get("role");

  const onClickLogOut = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("userDetails");
    Cookies.remove("role");
    navigate("/login", { replace: true });
  };

  const navbar = (
    <Navbar collapseOnSelect expand="lg" className="home-bg-container">
      <Container>
        <Navbar.Brand className="h-heading-nav" href="/">
          NM-Trends
        </Navbar.Brand>
        <div>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="h-icon"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              {role === "admin" ? (
                <>
                  <Nav.Link className="h-routes" href="/addproducts">
                    Add Products
                  </Nav.Link>
                  <Nav.Link className="h-routes" href="/cart">
                    View Orders
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link className="h-routes" href="/products">
                    Products
                  </Nav.Link>
                  <Nav.Link className="h-routes" href="/cart">
                    Cart
                  </Nav.Link>
                  <Nav.Link className="h-routes" href="/profile">
                    Profile
                  </Nav.Link>
                </>
              )}
              <Nav.Link onClick={onClickLogOut} className="h-routes">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
  

  
  return navbar;
}

export default Header;