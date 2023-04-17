import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import "./index.css";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";

function UserOrders() {
  const [ordersList, setOrdersList] = useState([]);
  const [showAddress, setShowAddress] = useState(false);

  // setShowAddress((prevState) => !prevState);

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
    setShowAddress(true);
    // {setShowAddress && du}
  };

  const displayAddressDetails = (each) => {
    if (each.showAddressDetails) {
      return (
        <Modal
          size="xs"
          show={showAddress}
          onHide={() => setShowAddress(false)}
        >
          <ModalHeader closeButton>
            Address
            {/* <button onClick={() => setShowAddress(!showAddress)}>X</button> */}
          </ModalHeader>
          <ModalBody>
            <div className="all-orders-details-container">
              <p className="all-orders-details">
                <b>Username:</b> {each.username}
              </p>
              <p className="all-orders-details">
                <b>Fullname:</b> {each.fullname}
              </p>
              <p className="all-orders-details">
                <b>Address:</b> {each.address}
              </p>
              <p className="all-orders-details">
                <b>Mobile:</b> {each.mobile}
              </p>
              <p className="all-orders-details">
                <b>Email:</b> {each.email}
              </p>
              <p className="all-orders-details">
                <b>State:</b> {each.state}
              </p>
              <p className="all-orders-details">
                <b>Pincode:</b> {each.pincode}
              </p>
            </div>
          </ModalBody>
        </Modal>
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
                  Show Address Details
                </button>
              </div>
              {displayAddressDetails(each)}
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
