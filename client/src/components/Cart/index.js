import React, { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../Header";
import EmptyCartView from "../EmptyCart";
import CartItem from "../CartItem";
import CartContext from "../../context/CartContext";
import "./index.css";

function Cart() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const emtyCart = cartItems.length === 0;
  console.log(cartItems);

  useEffect(() => {
    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const { username } = userDetails;
    console.log(username);
    axios
      .get("/getitems", { params: { username: `${username}` } })
      .then((response) => {
        console.log(response);
        setCartItems(response.data);
      });
  }, [setCartItems]);

  return (
    <>
      <Header />
      {emtyCart ? (
        <EmptyCartView />
      ) : (
        <div>
          <h1 className="c-heading-align">My Cart</h1>
          <div className="c-btn-align">
            <button className="c-btn-style">Remove All</button>
          </div>

          <ul className="cart-list">
            {cartItems.map((eachCartItem) => (
              <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Cart;
