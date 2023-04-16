import React, { useContext } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
// import { BsDashSquare, BsPlusSquare } from "react-icons/bs";
import CartContext from "../../context/CartContext";

import "./index.css";
function CartItem(props) {
  const { cartItemDetails } = props;
  const { cartItems, setCartItems } = useContext(CartContext);

  // const { addItemToCart } = useContext(CartContext);

  const { id, quantity, title, price, image_url } = cartItemDetails;
  // console.log(cartItemDetails);

  // const [qty, setCartQty] = useState(quantity);

  const removeItemFromCart = () => {
    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const { username } = userDetails;
    // console.log(username, id);
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

  // const onIncrementCartItemQuantity = () => {
  //   if (qty < 5) {
  //     setCartQty((prevState) => prevState + 1);

  //     const updatedProductsList = cartItems.map((product) => {
  //       if (product.id === id) {
  //         return { ...product, quantity: qty + 1 };
  //       }
  //       addItemToCart(product, qty);
  //       return product;
  //     });
  //   }
  // };

  // const onDecrementCartItemQuantity = () => {
  //   if (qty > 1) {
  //     setCartQty((prevState) => prevState - 1);

  //     const updatedProductsList = cartItems.map((product) => {
  //       if (product.id === id) {
  //         return { ...product, quantity: qty - 1 };
  //       }
  //       addItemToCart(product, qty);
  //       return product;
  //     });
  //     // addItemToCart(updatedProductsList, qty);
  //   }
  // };

  return (
    <li className="align-container-big">
      <div className="cart-item">
        <img className="cart-product-image" src={image_url} alt={title} />
        <div className="cart-item-details-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-quantity">qty: {quantity}</p>
        </div>
        {/* <div className="cart-quantity-container">
          <button
            type="button"
            onClick={onDecrementCartItemQuantity}
            className="quantity-controller-button"
          >
            <BsDashSquare color="#52606D" size={12} />
          </button>
          <p className="cart-quantity">{qty}</p>
          <button
            type="button"
            onClick={onIncrementCartItemQuantity}
            className="quantity-controller-button"
          >
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div> */}
        <p className="cart-total-price">Rs {price * quantity}/-</p>
        <button className="c-delete-button" onClick={removeItemFromCart}>
          <MdOutlineDeleteForever />
        </button>
      </div>
    </li>
  );
}
export default CartItem;
