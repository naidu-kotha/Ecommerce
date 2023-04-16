import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import axios from "axios";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Header";
import { states, numberOptions } from "../constants";
import "./index.css";
import { toast, ToastContainer } from "react-toastify";

function CreateOrder() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [cartQuantity, setCartQuantity] = useState("");

  const [productsList, setProductsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [stateError, setStateError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [itemError, setItemError] = useState("");
  const [qtyError, setQtyError] = useState("");

  const [deliveryDate, setDeliveryDate] = useState(
    new Date().setDate(new Date().getDate() + 3)
  );

  const handleSelect = (event) => {
    setSelectedState(event.value);
  };

  const userDetails = JSON.parse(Cookies.get("userDetails"));

  // console.log(userDetails);

  useEffect(() => {
    axios.get("/getproducts").then((response) => {
      if (response.statusText === "OK") {
        const updatedProductsData = response.data.map((each) => ({
          id: each.id,
          brand: each.brand,
          category: each.category,
          imageUrl: each.image_url,
          price: each.price,
          title: each.title,
        }));
        setProductsList(updatedProductsData);
        // console.log(productsList);
      }
    });
  }, []);

  const onChangeCategory = (event) => {
    setCategory(event.value);

    const filteredItems = productsList.filter(
      (eachItem) => eachItem.category === event.value
    );

    const itemList = filteredItems.map((each) => ({
      label: each.title,
      value: each.title,
    }));

    setItemsList(itemList);

    setItem("");

    console.log(filteredItems);
  };

  const onSelectItem = (event) => {
    setItem(event);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);

  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 6);

  const categoryList = [
    {
      label: "clothes",
      value: "clothes",
    },
    {
      label: "appliances",
      value: "appliances",
    },
    {
      label: "electronics",
      value: "electronics",
    },
    {
      label: "grocery",
      value: "grocery",
    },
    {
      label: "toys",
      value: "toys",
    },
  ];

  const submitForm = async (formikValues) => {
    if (selectedState === "") {
      setStateError("Required*");
    } else {
      setStateError("");
    }
    if (selectedCategory === "") {
      setCategoryError("Required*");
    } else {
      setCategoryError("");
    }
    if (item === "") {
      setItemError("Required*");
    } else {
      setItemError("");
    }
    if (cartQuantity === "") {
      setQtyError("Required*");
    } else {
      setQtyError("");
    }
    if (selectedCategory && item && selectedState && cartQuantity) {
      formikValues.id = uuidv4();
      formikValues.category = selectedCategory;
      formikValues.title = item.value;
      formikValues.state = selectedState;
      formikValues.quantity = cartQuantity;
      formikValues.username = userDetails.username;
      formikValues.deliveryDate = deliveryDate;
      // console.log(formikValues);

      await axios
        .post("/createorder/", formikValues)
        .then((respone) => {
          console.log(respone);
          toast.success(respone.data);
          formikMagzine.resetForm();
        })
        .catch((e) => {
          console.log(e);
        });
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
      console.log(values);
      submitForm(values);
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

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="bg-container">
        <h1 className="m-heading">Create Your Order</h1>
        <div className="page-align">
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
              {formikMagzine.touched.fullname &&
              formikMagzine.errors.fullname ? (
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
                <div className="m-error">
                  {formikMagzine.errors.mobileNumber}
                </div>
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
                  onChange={handleSelect}
                  placeholder={<div>Select your state</div>}
                  className="order-category-select"
                />
                {stateError && <p className="m-error">{stateError}</p>}
              </div>
              <div>
                <label htmlFor="category" className={"name-heading"}>
                  Category
                </label>
                <Select
                  id="category"
                  className="order-category-select"
                  options={categoryList}
                  isSearchable={false}
                  placeholder={<div>Select required category</div>}
                  onChange={onChangeCategory}
                />
                {categoryError && <p className="m-error">{categoryError}</p>}
              </div>
              <div>
                <label htmlFor="items" className={"name-heading"}>
                  Items
                </label>
                <Select
                  id="items"
                  className="order-category-select"
                  options={itemsList}
                  isSearchable={false}
                  placeholder={<div>Select Items</div>}
                  onChange={onSelectItem}
                  value={item}
                />
                {itemError && <p className="m-error">{itemError}</p>}
              </div>
              <div>
                <label htmlFor="qty" className={"name-heading"}>
                  Quantity
                </label>
                <Select
                  id="qty"
                  className="order-qty-select"
                  options={numberOptions}
                  isSearchable={false}
                  placeholder={<div>Select quantity</div>}
                  onChange={(e) => setCartQuantity(e.value)}
                />
                {qtyError && <p className="m-error">{qtyError}</p>}
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
            <div className="btn-submit-align">
              <button type="submit" className="btn-save">
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default CreateOrder;
