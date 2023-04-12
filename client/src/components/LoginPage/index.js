import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

import "./index.css";

function LoginPage() {
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      setSubmitting(true);
      console.log(values);
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should be at least 3 characters long.")
        .required("Required*"),
      password: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .required("Required*"),
    }),
  });

  useEffect(() => {
    if (submitting) {
      axios
        .post("http://localhost:5000/api/login/", formik.values)
        .then((response) => {
          setApiResponse(response.data);
          console.log(response.data);
          formik.resetForm();
        })
        .catch((e) => {
          console.log(e);
          setErrorMsg(e.response);
        });
    }
    setSubmitting(false);
  }, [submitting, formik.values, apiResponse]);

  return (
    <div className="l-align-name">
      <p className="heading">please login to be continued</p>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <div>
            <p className="l-disc">Username*</p>
            <input
              value={formik.values.username}
              onChange={formik.handleChange}
              name="username"
              id="username"
              className="l-input2"
              type="text"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="l-error">{formik.errors.username}</div>
            ) : null}
          </div>
          <div>
            <p className="l-disc">password*</p>
            <input
              value={formik.values.password}
              onChange={formik.handleChange}
              name="password"
              id="password"
              className="l-input2"
              type="password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="l-error">{formik.errors.password}</div>
            ) : null}
          </div>
        </div>
        <div className="l-btn-align">
          <button type="submit" className="l-btn">
            LogIn
          </button>
        </div>
        {errorMsg && <p className="l-error">{errorMsg.data}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
