import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import Header from "../Header";
import EmptyCartView from "../EmptyCart";
import { states } from "../constants";
import CartItem from "../CartItem";
import CartContext from "../../context/CartContext";
import "./index.css";

function Cart() {
  const [openAddress, setOpenAddress] = useState(false);
  const [selectedState, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const { cartItems, setCartItems } = useContext(CartContext);
  const emtyCart = cartItems.length === 0;
  // console.log(cartItems);

  const userDetails = JSON.parse(Cookies.get("userDetails"));
  const { username } = userDetails;
  // console.log(username);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);

  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 6);

  const [deliveryDate, setDeliveryDate] = useState(
    new Date().setDate(new Date().getDate() + 3)
  );

  useEffect(() => {
    axios
      .get("/getitems", { params: { username: `${username}` } })
      .then((response) => {
        // console.log(response);
        setCartItems(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setCartItems]);

  const removeItemsFromCart = () => {
    axios
      .delete("/deleteitem", { params: { username: `${username}` } })
      .then((response) => {
        console.log(response);
        setCartItems([]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createOrder = (values) => {
    if (selectedState === "") {
      return setStateError("Required*");
    } else {
      setStateError("");
      // console.log(values);
      cartItems.forEach((each) => {
        const data = { ...each, ...values };
        data.state = selectedState;
        data.deliveryDate = deliveryDate;
        console.log(data);
        axios
          .post("/createorder/", data)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
            return;
          });
      });
      toast.success("Order placed");
      formikMagzine.resetForm();
    }
  };

  const formikMagzine = useFormik({
    initialValues: {
      mobileNumber: userDetails.mobile || "",
      email: userDetails.email || "",
      postalCode: "",
      fullname: userDetails.fullname || "",
      address: "",
    },
    onSubmit: (values) => {
      // console.log(values);
      createOrder(values);
    },
    validationSchema: Yup.object({
      postalCode: Yup.string()
        .length(6, "needed 6 numbers only")
        .required("Required*"),
      mobileNumber: Yup.string()
        .length(10, "needed 10 numbers")
        .required("Required*"),
      email: Yup.string().email("invalid email id").required("Required*"),
      fullname: Yup.string().required("Required*"),
      address: Yup.string().required("Required*"),
    }),
  });

  const addressDetails = () => {
    return (
      <div className="order-submit-container">
        <form
          onSubmit={formikMagzine.handleSubmit}
          className={"magazine-container"}
        >
          <div className={"magazine-input-container"}>
            <label htmlFor="fullname" className={"name-heading"}>
              Fullname
            </label>
            <input
              id="fullname"
              className={"input-sizes"}
              type={"text"}
              {...formikMagzine.getFieldProps("fullname")}
            />
            {formikMagzine.touched.fullname && formikMagzine.errors.fullname ? (
              <div className="m-error">{formikMagzine.errors.fullname}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <label htmlFor="email" className={"name-heading"}>
              Email
            </label>
            <input
              id="email"
              className={"input-sizes"}
              type={"email"}
              {...formikMagzine.getFieldProps("email")}
            />
            {formikMagzine.touched.email && formikMagzine.errors.email ? (
              <div className="m-error">{formikMagzine.errors.email}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <label htmlFor="phone" className={"name-heading"}>
              Phone Number
            </label>
            <input
              id="phone"
              className={"input-sizes number-input"}
              type={"number"}
              {...formikMagzine.getFieldProps("mobileNumber")}
            />
            {formikMagzine.touched.mobileNumber &&
            formikMagzine.errors.mobileNumber ? (
              <div className="m-error">{formikMagzine.errors.mobileNumber}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <label htmlFor="zipcode" className={"name-heading"}>
              Postal/Zip code
            </label>
            <input
              id="zipcode"
              className={"input-sizes number-input"}
              type={"number"}
              {...formikMagzine.getFieldProps("postalCode")}
            />
            {formikMagzine.touched.postalCode &&
            formikMagzine.errors.postalCode ? (
              <div className="m-error">{formikMagzine.errors.postalCode}</div>
            ) : null}
          </div>
          <div className={"street-align"}>
            <label htmlFor="address" className={"name-heading"}>
              Street Address
            </label>
            <input
              id="address"
              className={"input-sizes"}
              type={"text"}
              {...formikMagzine.getFieldProps("address")}
            />
            {formikMagzine.touched.address && formikMagzine.errors.address ? (
              <div className="m-error">{formikMagzine.errors.address}</div>
            ) : null}
          </div>
          <div className="react-select-container">
            <div>
              <label htmlFor="state" className={"name-heading"}>
                State
              </label>
              <Select
                id="state"
                options={states}
                onChange={(option) => setState(option.value)}
                placeholder={<div>Select your state</div>}
                className="order-category-select"
              />
              {stateError && <p className="m-error">{stateError}</p>}
            </div>
            <div>
              <p className={"name-heading"}>Select Delivery Date</p>
              <DatePicker
                className="date-picker"
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <button className="order-submit" type="submit">
            Place order
          </button>
        </form>
      </div>
    );
  };

  return (
    <>
      <Header />
      {emtyCart ? (
        <EmptyCartView />
      ) : (
        <div className="cart-container">
          <ToastContainer />
          <h1 className="c-heading-align">My Cart</h1>
          <div className="c-btn-align">
            <button className="c-btn-style" onClick={removeItemsFromCart}>
              Remove All
            </button>
          </div>
          <ul className="cart-list">
            {cartItems.map((eachCartItem) => (
              <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
            ))}
          </ul>
          <div className="order-submit-container">
            {cartItems.length > 0 && (
              <button
                className="order-submit"
                onClick={() => setOpenAddress((prevState) => !prevState)}
              >
                Fill Address Details
              </button>
            )}
          </div>
          {openAddress && addressDetails()}
        </div>
      )}
    </>
  );
}

export default Cart;
