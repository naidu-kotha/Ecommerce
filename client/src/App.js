import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Profile from "./components/Profile";
// import ChangePassword from "./components/ChangePassword";
// import MagazineForm from "./components/Magazine";
// import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
// import SignUp from "./components/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />
        {/* <SignUp />
      <Header />
      <Profile />
      <ChangePassword />
      <MagazineForm /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
