import React, { useState } from "react";
import Header from "../Header";
import { storage } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "./index.css";
import axios from "axios";

const intialImage =
  "https://w7.pngwing.com/pngs/88/823/png-transparent-logo-product-design-brand-trademark-new-product-promotion-blue-text-trademark-thumbnail.png";

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

function AddProducts() {
  const [selectedCategory, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(intialImage);
  const [categoryError, setCategoryError] = useState("");
  const [imageError, setImageError] = useState("");

  const formikAddProduct = useFormik({
    initialValues: {
      title: "",
      price: "",
      brand: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required*"),
      brand: Yup.string().required("Required*"),
      price: Yup.string().required("Required*"),
    }),
    onSubmit: (values) => {
      if (selectedCategory === "") {
        setCategoryError("Required*");
      } else {
        setCategoryError("");
      }
      if (url === intialImage) {
        setImageError("Upload product image");
      } else {
        setImageError("");
      }
      if (selectedCategory && url !== intialImage) {
        values.imageUrl = url;
        values.category = selectedCategory;
        console.log(values);
        axios
          .post("/addproduct/", values)
          .then((response) => {
            console.log(response);
            toast.success(response.data.message);
            formikAddProduct.resetForm();
          })
          .catch((e) => {
            console.log(e);
            if (e.response.data.errno === 1062) {
              toast.error("Product Already Exists");
            }
          });
        setImage(null);
        setUrl(intialImage);
      }
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files[0] !== "") {
      setImage(e.target.files[0]);
    }
  };
  const handlesubmit = () => {
    const imageRef = ref(storage, "image" + v4());
    console.log(imageRef);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            console.log(url);
            setUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the url");
          });
        setImage(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  //console.log(url);
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="add-product-bg-container-total">
        <div className="add-products-img-align">
          <form
            onSubmit={formikAddProduct.handleSubmit}
            className="add-product-bg-container"
          >
            <div className="add-product-card">
              <div>
                <label className="add-product-label">Category</label>
                <br />
                <Select
                  className="add-product-input"
                  options={categoryList}
                  isSearchable={false}
                  placeholder={<div>Select required category</div>}
                  onChange={(option) => setCategory(option.value)}
                />
                {setCategoryError && <p className="m-error">{categoryError}</p>}
              </div>
              <div>
                <label className="add-product-label" htmlFor="title">
                  Title
                </label>
                <br />
                <input
                  {...formikAddProduct.getFieldProps("title")}
                  className="add-product-input"
                  id="title"
                  type="text"
                />
                {formikAddProduct.touched.title &&
                formikAddProduct.errors.title ? (
                  <div className="l-error">{formikAddProduct.errors.title}</div>
                ) : null}
              </div>
              <div>
                <label className="add-product-label" htmlFor="price">
                  Price
                </label>
                <br />
                <input
                  {...formikAddProduct.getFieldProps("price")}
                  className="add-product-input number-input"
                  id="price"
                  type="number"
                />

                {formikAddProduct.touched.price &&
                formikAddProduct.errors.price ? (
                  <div className="l-error">{formikAddProduct.errors.price}</div>
                ) : null}
              </div>
              <div>
                <label className="add-product-label" htmlFor="brand">
                  Brand
                </label>
                <br />
                <input
                  {...formikAddProduct.getFieldProps("brand")}
                  className="add-product-input"
                  id="brand"
                  type="text"
                />
                {formikAddProduct.touched.brand &&
                formikAddProduct.errors.brand ? (
                  <div className="l-error">{formikAddProduct.errors.brand}</div>
                ) : null}
              </div>

              <button type="submit" className="add-product-add-button">
                Add Item
              </button>
            </div>
          </form>
        </div>
        <div className="add-product-img-container">
          <img className="add-product-img-size" src={url} alt="uploaded img" />
          <div className="add-product-uploadImage-container">
            <input
              className="add-product-choose-file"
              type="file"
              onChange={handleImageChange}
            />
            {imageError && <p className="m-error">{imageError}</p>}
            <button
              className="add-product-submit-button"
              onClick={handlesubmit}
            >
              Add Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddProducts;
