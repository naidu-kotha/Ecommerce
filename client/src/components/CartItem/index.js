import React, { useContext } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import CartContext from "../../context/CartContext";

import "./index.css";
function CartItem(props) {
  const { cartItemDetails } = props;
  const { cartItems, setCartItems } = useContext(CartContext);

  const { id, quantity, title, price, image_url } = cartItemDetails;
  console.log(cartItemDetails);

  const removeItemFromCart = () => {
    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const { username } = userDetails;
    console.log(username, id);
    axios
      .delete("/deleteitem", {
        data: { id },
        params: { username: `${username}` },
      })
      .then((response) => {
        console.log(response);
        setCartItems(cartItems.filter((cartItem) => cartItem.id !== id));
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  return (
    <li className="align-container-big">
      <div className="cart-item">
        <img className="cart-product-image" src={image_url} alt={title} />
        <div className="cart-item-details-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-quantity">qty: {quantity}</p>
        </div>
        <p className="cart-total-price">Rs {price * quantity}/-</p>
        <button className="c-delete-button" onClick={removeItemFromCart}>
          <MdOutlineDeleteForever />
        </button>
      </div>
    </li>
  );
}
export default CartItem;