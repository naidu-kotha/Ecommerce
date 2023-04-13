import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
function SignUp() {
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      const id = uuidv4();
      values.id = id;
      setSubmitting(true);
      console.log(values);
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

  useEffect(() => {
    if (submitting) {
      axios
        .post("/createuser", formik.values)
        .then((response) => {
          setErrorMsg("");
          console.log(response);
          if (response.statusText === "OK") {
            // alert("Sign up success. Proceed to Login.");
            toast.success("Sign up success. Proceed to Login.");

            navigate("/login", { replace: true });
          }
          formik.resetForm();
        })
        .catch((e) => {
          console.log(e);
          const data = e.response.data;
          console.log(data);
          if (data.errno === 1062) {
            formik.resetForm();
            setErrorMsg(
              "Username already exists. Please try with a different username"
            );
          }
        });
    }
    setSubmitting(false);
  }, [submitting, formik.values, formik, navigate]);

  return (
    <div className="align-left">
      <div className="align-middle">
        <div className="s-align-name">
          <h1 className="s-sign">Sign Up</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="s-input-container">
              <label className="s-disc">USERNAME*</label>
              <br />
              <input
                {...formik.getFieldProps("username")}
                className="s-input2"
                type="text"
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="s-error">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="s-input-container">
              <label className="s-disc ">PASSWORD*</label>
              <div className="s-container-visible">
                <br />
                <input
                  {...formik.getFieldProps("password")}
                  className="s-input2 s-password-symbol"
                  type={showPassword ? "text" : "password"}
                />
                <span>
                  <button
                    type="button"
                    className="s-eye-button l-password-symbol"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="s-error">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="s-btn-align">
              <button type="submit" className="s-btn">
                Sign Up
              </button>
            </div>
            {errorMsg && <p className="l-error">{errorMsg}</p>}
          </form>
          <p className="signup-link">
            Have an account?{" "}
            <Link className="signup-link-style" to="/login">
              Log in
            </Link>
          </p>
        </div>
        <div className="s-img">
          <img
            src="https://res.cloudinary.com/dhghcct1x/image/upload/v1681367762/Group_2014_rv9sjn.png"
            alt="imag"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default SignUp;
