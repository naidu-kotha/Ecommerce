import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import * as Yup from "yup";
// import CartContext from "../../context/CartContext";

import "./index.css";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      axios
        .post("/login/", formik.values)
        .then((response) => {
          setErrorMsg("");
          console.log(response.data);
          if (response.statusText === "OK") {
            // alert("Sign up success. Proceed to Login.");
            //toast.success("Sign up success. Proceed to Login.");

            navigate("/", { replace: true });
          }
          formik.resetForm();
          const { jwtToken, results } = response.data;
          const { role } = results[0];
          // console.log(role);
          Cookies.set("jwt_token", jwtToken, { expires: 10 });
          Cookies.set("role", role, { expires: 10 });
          Cookies.set("userDetails", JSON.stringify(results[0]), {
            expires: 10,
          });
        })
        .catch((e) => {
          console.log(e);
          setErrorMsg(e.response);
        });
      // setSubmitting(true);
      // console.log(values);
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should be at least 3 characters long.")

        .required("Required*"),
      password: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .matches(
          "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))",
          "needed one (upperCase,lowercase,symbol)"
        )
        .required("Required*"),
    }),
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="l-align-middle">
      <div className="l-align-name">
        <img
          src="https://res.cloudinary.com/dhghcct1x/image/upload/v1681363233/Group_mupabc.png"
          alt="cart"
          className="l-img-cart"
        />
        <form onSubmit={formik.handleSubmit}>
          <div className="l-input-container">
            <label htmlFor="username" className="l-disc">
              USERNAME*
            </label>
            <br />
            <input
              {...formik.getFieldProps("username")}
              className="l-input2"
              type="text"
              id="username"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="l-error">{formik.errors.username}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="l-disc">
              PASSWORD*
            </label>
            <div className="l-input-container">
              <div className="l-container-visible ">
                <input
                  {...formik.getFieldProps("password")}
                  className="l-input2 l-password-symbol"
                  type={showPassword ? "text" : "password"}
                  id="password"
                />
                <span>
                  <button
                    type="button"
                    className="l-eye-button l-password-symbol"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="l-error">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className="l-btn-align">
            <button type="submit" className="l-btn">
              Log in
            </button>
          </div>

          {errorMsg && <p className="l-error">{errorMsg.data}</p>}
        </form>
        <p className="login-link">
          New user?{" "}
          <Link className="login-link-style" to="/signup">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;