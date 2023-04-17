import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import CreateOrder from "./components/CreateOrder";
import Profile from "./components/Profile";
import AddProducts from "./components/AddProducts";
import Cart from "./components/Cart";
import Products from "./components/Products";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import UserOrders from "./components/UserOrders";
import CartContext from "./context/CartContext";
import AllOrders from "./components/AllOrders";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const jwtToken = Cookies.get("jwt_token");

  const addItemToCart = (item, quantity) => {
    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const { username } = userDetails;
    console.log(item);
    console.log(quantity);

    axios
      .post(
        "/addtocart",
        { item, quantity, username },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setCartItems([]);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  // const removeItemFromCart = (itemId) => {
  //   setCartItems(cartItems.filter((cartItem) => cartItem.id !== itemId));
  // };

  // const clearCart = () => {
  //   setCartItems([]);
  // };

  return (
    <BrowserRouter>
      <CartContext.Provider
        value={{
          cartItems,
          addItemToCart,
          // removeItemFromCart,
          // clearCart,
          setCartItems,
          // setUsername,
          // userDetails,
        }}
      >
        <Routes>
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            exact
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            exact
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            exact
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproducts"
            exact
            element={
              <AdminProtectedRoute>
                <AddProducts />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/allorders"
            exact
            element={
              <AdminProtectedRoute>
                <AllOrders />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/createorder"
            exact
            element={
              <ProtectedRoute>
                <CreateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vieworders"
            exact
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartContext.Provider>
    </BrowserRouter>
  );
}
export default App;
