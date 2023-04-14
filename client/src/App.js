import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/Profile";
import Cookies from "js-cookie";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Products from "./components/Products";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import CartContext from "./context/CartContext";
import NotFound from "./components/NotFound";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const isAuthenticated = Cookies.get('jwt_token') !== null;
    setIsSignedIn(isAuthenticated);
  }, []);

  const addItemToCart = (item, quantity) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.id === item.id) {
          return { ...cartItem, quantity: cartItem.quantity + quantity };
        } else {
          return cartItem;
        }
      });

      setCartItems(updatedCartItems);
    } else {
      const newCartItem = { ...item, quantity };
      setCartItems([...cartItems, newCartItem]);
    }

    console.log(cartItems);
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <BrowserRouter>
      <CartContext.Provider
        value={{
          cartItems,
          addItemToCart,
          removeItemFromCart,
          clearCart,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={isSignedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/products" element={isSignedIn ? <Products /> : <Navigate to="/login" />}/>
          <Route path="/cart" element={isSignedIn ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isSignedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/notfound" element = {<NotFound/>}/>
          {/* <Navigate to="/notfound"/>  */}
        </Routes>
      </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;
