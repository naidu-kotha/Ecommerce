import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

import Header from "../Header";
import "./index.css";

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const userDetails = JSON.parse(Cookies.get("userDetails"));
  // console.log(userDetails);
  const { username, fullname, email, mobile } = userDetails;

  const customStyles = {
    content: {
      width: "50%",
      margin: "auto",
      // display: "flex",
      // justifyContent: "center",
      // alignItems: "center",
      height: "100vh",
      overflow: "hidden",
    },
  };

  const navigate = useNavigate();

  const formikProfile = useFormik({
    initialValues: {
      fullname: "",
      mobile: "",
      email: "",
    },
    onSubmit: (values) => {
      // console.log(values);
      const userDetails = JSON.parse(Cookies.get("userDetails"));
      const { username } = userDetails;
      axios
        .patch("/updateuser/", formikProfile.values, {
          params: { username: `${username}` },
        })
        .then((response) => {
          values.username = username;
          console.log(values);
          console.log(response);
          Cookies.set("userDetails", JSON.stringify(formikProfile.values), {
            expires: 30,
          });
          formikProfile.resetForm();
          toast.success("Successfully updated");
          toggleModal();
        });
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .min(3, "Fullname Should be at least 5 charactes")
        .required("Required*"),
      mobile: Yup.string()
        .min(10, "needed 10 numbers")
        .matches("^[6789][0-9]{9}$", "needed numbers only")
        .required("Required*"),
      email: Yup.string()
        .email("invalid email id")
        .matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")
        .required("Required*"),
    }),
  });

  const formikPassword = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      reEnterNewPassword: "",
    },
    onSubmit: (values) => {
      console.log(values);
      axios
        .patch("/changepassword/", formikPassword.values, {
          params: { username: `${username}` },
        })
        .then((response) => {
          console.log(response);
          toast.success("Password changed");
          Cookies.remove("jwt_token");
          Cookies.remove("userDetails");
          Cookies.remove("role");
          navigate("/login", { replace: true });
        })
        .catch((e) => {
          console.log(e);
          toast.warning("Unable to change password");
        });
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .matches(
          "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))",
          "needed one (upperCase,lowercase,symbol)"
        )
        .required("Required*"),
      newPassword: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .matches(
          "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))",
          "needed one (upperCase,lowercase,symbol)"
        )
        .required("Required*"),
      reEnterNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalOpen(!isPasswordModalOpen);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <>
      <ToastContainer />

      <div className="p-margin">
        <Header />
        <div className="profile-card-align-middle">
          <div className="profile-card-container">
            <div>
              <p className="profile-name-headings">
                username: <span className="profile-inputs">{username}</span>
              </p>
              <p className="profile-name-headings">
                fullname: <span className="profile-inputs">{fullname}</span>
              </p>
              <p className="profile-name-headings">
                email:
                <span className="profile-inputs">{email}</span>
              </p>
              <p className="profile-name-headings">
                number: <spam className="profile-inputs">{mobile}</spam>
              </p>
            </div>

            <div className="profile-butoons-container">
              <button
                onClick={toggleModal}
                className="profile-edit-profile-button"
              >
                Edit profile
              </button>
              <button
                onClick={togglePasswordModal}
                className="profile-edit-password-button"
              >
                Edit password
              </button>
            </div>
          </div>
        </div>
        <div>
          <Modal
            style={customStyles}
            className="p-model-size"
            isOpen={isModalOpen}
          >
            <form className="p-form" onSubmit={formikProfile.handleSubmit}>
              <h1 className="p-profile_name">Profile</h1>
              <div className="p-inputs-align">
                <p className="p-names">Fullname</p>
                <input
                  {...formikProfile.getFieldProps("fullname")}
                  className="p-input5"
                  type="text"
                  placeholder="Enter name"
                />
                {formikProfile.touched.fullname &&
                formikProfile.errors.fullname ? (
                  <div className="p-error">{formikProfile.errors.fullname}</div>
                ) : null}
              </div>
              <div className="p-inputs-align">
                <p className="p-names">Mobile Number</p>
                <input
                  {...formikProfile.getFieldProps("mobile")}
                  className="p-input5 number-input"
                  type="number"
                  placeholder="Enter Mobile"
                />
                {formikProfile.touched.mobile && formikProfile.errors.mobile ? (
                  <div className="p-error">{formikProfile.errors.mobile}</div>
                ) : null}
              </div>
              <div className="p-inputs-align">
                <p className="p-names">Email</p>
                <input
                  {...formikProfile.getFieldProps("email")}
                  className="p-input5"
                  type="email"
                  placeholder="Enter Email"
                />
                {formikProfile.touched.email && formikProfile.errors.email ? (
                  <div className="p-error">{formikProfile.errors.email}</div>
                ) : null}
              </div>

              <hr />
              <div className="p-left-align">
                <div className="p-btn-align2">
                  <button
                    className="p-buttons p-btn-cancel"
                    type="button"
                    onClick={toggleModal}
                  >
                    cancel
                  </button>
                  <button className="p-buttons p-btn-save" type="submit">
                    save
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </div>

        <Modal
          isOpen={isPasswordModalOpen}
          className="modal-style p-model-size"
        >
          <div className="c-margin">
            <div className="c-aligning">
              {/* <h1 className="c-profile_name">Change Password</h1> */}
              <div className="c-aligning">
                <form className="c-form" onSubmit={formikPassword.handleSubmit}>
                  <div className="c-inputs-align">
                    <label className="user-details">Current Password</label>
                    <input
                      className="c-input1"
                      {...formikPassword.getFieldProps("currentPassword")}
                      type="password"
                      placeholder="Enter current password"
                    />
                    {formikPassword.touched.currentPassword &&
                    formikPassword.errors.currentPassword ? (
                      <div className="c-error">
                        {formikPassword.errors.currentPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="c-inputs-align">
                    <p className="c-names">Enter New Password</p>
                    <div className="p-container-visible">
                      <input
                        {...formikPassword.getFieldProps("newPassword")}
                        className="c-input1"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                      />
                      <span>
                        <button
                          type="button"
                          className="p-eye-button p-password-symbol"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </span>
                    </div>

                    {formikPassword.touched.newPassword &&
                    formikPassword.errors.newPassword ? (
                      <div className="c-error">
                        {formikPassword.errors.newPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="c-inputs-align">
                    <p className="c-names">Re-Enter New Password</p>
                    <div className="p-container-visible">
                      <input
                        {...formikPassword.getFieldProps("reEnterNewPassword")}
                        className="c-input1"
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Enter New Password"
                      />
                      <span>
                        <button
                          type="button"
                          className="p-eye-button p-password-symbol"
                          onClick={togglePasswordVisibility2}
                        >
                          {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </span>
                    </div>

                    {formikPassword.touched.reEnterNewPassword &&
                    formikPassword.errors.reEnterNewPassword ? (
                      <div className="c-error">
                        {formikPassword.errors.reEnterNewPassword}
                      </div>
                    ) : null}
                  </div>
                  {/* <div className="c-inputs-align">
                    <p className="c-names">Re-Enter New Password</p>
                    <input
                      {...formikPassword.getFieldProps("reEnterNewPassword")}
                      className="c-input1"
                      type="password"
                      placeholder="Re-Enter New Password"
                    />
                    {formikPassword.touched.reEnterNewPassword &&
                    formikPassword.errors.reEnterNewPassword ? (
                      <div className="c-error">
                        {formikPassword.errors.reEnterNewPassword}
                      </div>
                    ) : null}
                  </div> */}

                  <hr />
                  <div className="c-left-align">
                    <div className="c-btn-align3">
                      <button
                        className="c-buttons c-btn-cancel"
                        type="button"
                        onClick={togglePasswordModal}
                      >
                        cancel
                      </button>
                      <button className="c-buttons c-btn-save" type="submit">
                        save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <img
                className="img"
                alt="change password bg"
                src="https://res.cloudinary.com/dck3ikgrn/image/upload/v1681409529/5fz9SMYxWbv44jFVcD4vmd-970-80.jpg_wdqezt.webp"
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Profile;
