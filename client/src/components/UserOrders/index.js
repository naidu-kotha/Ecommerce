import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import "./index.css";

function UserOrders() {
  const userDetails = JSON.parse(Cookies.get("userDetails"));
  const { username } = userDetails;

  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    axios
      .get("/getorders", { params: { username: `${username}` } })
      .then((respone) => {
        console.log(respone);
        setOrdersList(respone.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const showOrders = () => {
    return (
      <ul>
        {ordersList.map((each) => (
          <li className="orders-container-big">
            <div className="order-item">
              <img
                src={each.image_url}
                alt={each.id}
                className="cart-product-image"
              />
              <div className="order-item-details-container">
                <p className="cart-product-title">{each.title}</p>
                <p className="cart-quantity">qty: {each.quantity}</p>
              </div>
              <p className="cart-product-title">
                Delivery date:
                {new Date(each.delivery_date).toLocaleDateString("en-GB")}
              </p>
              <p className="cart-total-price">
                Rs {each.price * each.quantity}/-
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />
      <div>
        <h1 className="orders-heading">Orders</h1>
        {ordersList.length > 0 ? showOrders() : null}
      </div>
    </>
  );
}

export default UserOrders;
