import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../Header";
import "./index.css";

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formikProfile = useFormik({
    initialValues: {
      firstname: "",
      mobileNumber: "",
      email: "",
    },
    onSubmit: (values) => {
      // console.log(values);
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const { username } = userDetails;
      axios
        .patch("/updateuser/", formikProfile.values, {
          params: { username: `${username}` },
        })
        .then((response) => {
          formikProfile.resetForm();
          toast.success("Successfully updated");
        });
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .min(3, "First Name Should be at least 5 charactes")
        .required("Required*"),
      mobileNumber: Yup.string()
        .min(10, "needed 10 numbers")
        .required("Required*"),
      email: Yup.string().email("invalid email id").required("Required*"),
    }),
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="p-margin">
        <div className="profile-details">
          <div className="profile-heading-container">
            <h1 className="profile-heading">Account</h1>
            <button className="edit-profile-btn" onClick={toggleModal}>
              Edit Profile
            </button>
          </div>
          <hr className="h-line" />
          <div className="profile-details-container">
            <div className="details-container">
              <h1>Username</h1>
              <p></p>
            </div>
            <div className="details-container">
              <h1>Full name</h1>
              <p></p>
            </div>
            <div className="details-container">
              <h1>email</h1>
              <p></p>
            </div>
            <div className="details-container">
              <h1>mobile</h1>
              <p></p>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen}>
          <form className="p-form" onSubmit={formikProfile.handleSubmit}>
            <h1 className="p-profile_name">Profile</h1>
            <div className="p-inputs-align">
              <p className="p-names">First Name</p>
              <input
                {...formikProfile.getFieldProps("firstname")}
                className="p-input5"
                type="text"
                placeholder="Enter name"
              />
              {formikProfile.touched.firstname &&
              formikProfile.errors.firstname ? (
                <div className="p-error">{formikProfile.errors.firstname}</div>
              ) : null}
            </div>
            <div className="p-inputs-align">
              <p className="p-names">Mobile Number</p>
              <input
                {...formikProfile.getFieldProps("mobileNumber")}
                className="p-input5 number-input"
                type="number"
                placeholder="Enter Mobile"
              />
              {formikProfile.touched.mobileNumber &&
              formikProfile.errors.mobileNumber ? (
                <div className="p-error">
                  {formikProfile.errors.mobileNumber}
                </div>
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
    </>
  );
}

export default Profile;
