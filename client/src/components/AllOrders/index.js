import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import "./index.css";

function UserOrders() {
  const [ordersList, setOrdersList] = useState([]);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    axios
      .get("/getorders")
      .then((respone) => {
        console.log(respone);
        setOrdersList(respone.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const toggleAddressDetails = (id) => {
    const updatedOrdersList = ordersList.map((order) => {
      if (order.id === id) {
        return { ...order, showAddressDetails: !order.showAddressDetails };
      }
      return order;
    });
    setOrdersList(updatedOrdersList);
    setShowAddress((prevState) => !prevState);
  };

  const displayAddressDetails = (each) => {
    if (each.showAddressDetails) {
      return (
        <div className="all-orders-details-container">
          <p className="all-orders-details">Username: {each.username}</p>
          <p className="all-orders-details">Fullname: {each.fullname}</p>
          <p className="all-orders-details">Address: {each.address}</p>
          <p className="all-orders-details">Mobile: {each.mobile}</p>
          <p className="all-orders-details">Email: {each.email}</p>
          <p className="all-orders-details">State: {each.state}</p>
          <p className="all-orders-details">Pincode: {each.pincode}</p>
        </div>
      );
    }
  };

  const showOrders = () => {
    return (
      <ul className="orders-list-ul">
        {ordersList.map((each) => (
          <div className="orders-container-big">
            <div>
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
                <button
                  className="address-button"
                  onClick={() => toggleAddressDetails(each.id)}
                >
                  {showAddress
                    ? "Hide Address Details"
                    : "Show Address Details"}
                </button>
              </div>
              {showAddress && displayAddressDetails(each)}
            </div>
          </div>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />
      <div className="orders-bg">
        <h1 className="orders-heading">Orders</h1>
        {ordersList.length > 0 ? showOrders() : null}
      </div>
    </>
  );
}

export default UserOrders;
