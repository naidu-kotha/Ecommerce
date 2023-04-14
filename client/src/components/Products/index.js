import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import Header from "../Header";

import CartContext from "../../context/CartContext";
import "./index.css";

function Products() {
  const [productsList, setProductsList] = useState([]);

  const [selectedCategory, setCategory] = useState([]);

  const [cartQuantity, setCartQuantity] = useState(1);

  const { addItemToCart } = useContext(CartContext);

  // const handleAddToCart = (item, quantity) => {
  //   addItemToCart(item, quantity);
  // };

  useEffect(() => {
    const category = selectedCategory;

    axios
      .get("/getproducts", { params: { category: `${category}` } })
      .then((response) => {
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
        }
      });
  }, [selectedCategory]);

  const categoryList = [
    {
      label: "default",
      value: "",
    },
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

  const numberOptions = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ];

  return (
    <div className="product-container">
      <Header/>
      <div className="products-select-container">
        <h1 className="products-heading">All Products</h1>
        <Select
          className="product-category-select"
          options={categoryList}
          isSearchable={false}
          placeholder={<div>Select required category</div>}
          onChange={(option) => setCategory(option.value)}
        />
      </div>

      <ul className="products-list-container">
        {productsList.map((eachProduct) => (
          <li key={eachProduct.id} className="product-card">
            <img
              src={eachProduct.imageUrl}
              alt={eachProduct.title}
              className="product-image"
            />
            <div className="product-details">
              <div>
                <h1 className="product-title">{eachProduct.title}</h1>
                <p className="product-brand">by {eachProduct.brand}</p>
                <p className="product-price">Rs.{eachProduct.price}</p>
              </div>
              <div className="product-btn-container">
                <Select
                  options={numberOptions}
                  defaultValue={numberOptions[0]}
                  isSearchable={false}
                  className="product-select"
                  onChange={(option) => setCartQuantity(option.value)}
                />
                <button
                  className="product-cart-btn"
                  onClick={() => {
                    addItemToCart(eachProduct, cartQuantity);
                    setCartQuantity(1);
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
