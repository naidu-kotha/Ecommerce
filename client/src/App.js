import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './components/Home';

import Profile from "./components/Profile";
// import MagazineForm from "./components/Magazine";
import Cart from "./components/Cart";
import Products from "./components/Products";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import CartContext from "./context/CartContext";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (item, quantity) => {
    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const { username } = userDetails;
    console.log(item);
    console.log(quantity);

    axios
      .post("/addtocart", { item, quantity, username })
      .then((response) => {
        console.log(response);
        setCartItems([]);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
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
          setCartItems
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
          <Route path="/products" exact element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" exact element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" exact element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* <SignUp />
      <Header />
      <Profile />
      <ChangePassword />
      <MagazineForm /> */}
        </Routes>
      </CartContext.Provider>
    </BrowserRouter>
  );
}
export default App;
// import React, { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./components/Profile";
// import Cookies from "js-cookie";
// import Home from "./components/Home";
// import Cart from "./components/Cart";
// import Products from "./components/Products";
// import LoginPage from "./components/LoginPage";
// import Signup from "./components/Signup";
// import CartContext from "./context/CartContext";
// import NotFound from "./components/NotFound";

// function App() {
//   const [cartItems, setCartItems] = useState([]);

//   const [isSignedIn, setIsSignedIn] = useState(false);

//   useEffect(() => {
//     const isAuthenticated = Cookies.get('jwt_token') !== null;
//     setIsSignedIn(isAuthenticated);
//   }, []);

//   const addItemToCart = (item, quantity) => {
//     const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

//     if (existingItem) {
//       const updatedCartItems = cartItems.map((cartItem) => {
//         if (cartItem.id === item.id) {
//           return { ...cartItem, quantity: cartItem.quantity + quantity };
//         } else {
//           return cartItem;
//         }
//       });

//       setCartItems(updatedCartItems);
//     } else {
//       const newCartItem = { ...item, quantity };
//       setCartItems([...cartItems, newCartItem]);
//     }

//     console.log(cartItems);
//   };

//   const removeItemFromCart = (itemId) => {
//     setCartItems(cartItems.filter((cartItem) => cartItem.id !== itemId));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <BrowserRouter>
//       <CartContext.Provider
//         value={{
//           cartItems,
//           addItemToCart,
//           removeItemFromCart,
//           clearCart,
//         }}
//       >
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/home" element={isSignedIn ? <Home /> : <Navigate to="/login" />} />
//           <Route path="/products" element={isSignedIn ? <Products /> : <Navigate to="/login" />}/>
//           <Route path="/cart" element={isSignedIn ? <Cart /> : <Navigate to="/login" />} />
//           <Route path="/profile" element={isSignedIn ? <Profile /> : <Navigate to="/login" />} />
//           <Route path="/notfound" element = {<NotFound/>}/>
//           {/* <Navigate to="/notfound"/>  */}
//         </Routes>
//       </CartContext.Provider>
//     </BrowserRouter>
//   );
// }

// export default App;
