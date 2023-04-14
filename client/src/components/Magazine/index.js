import { useState, React } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { states } from "../constants";
import "./index.css";

function MagazineForm() {
  const [selectedState, setSelectedState] = useState("");

  const handleSelect = (event) => {
    setSelectedState(event.target.value);
  };

  const formikMagzine = useFormik({
    initialValues: {
      mobileNumber: "",
      email: "",
      postalCode: "",
      firstName: "",
      lastName: "",
      address: "",
    },
    validationSchema: Yup.object({
      postalCode: Yup.string()
        .length(6, "needed 6 numbers only")
        .required("Required*"),
      mobileNumber: Yup.string()
        .length(10, "needed 10 numbers")
        .required("Required*"),
      email: Yup.string().email("invalid email id").required("Required*"),
      firstName: Yup.string().required("Required*"),
      lastName: Yup.string().required("Required*"),
      address: Yup.string().required("Required*"),
    }),
  });
  return (
    <div className="bg-container">
      <h1 className="m-heading">Magazine Request Forms</h1>
      <div className="page-align">
        <form
          onSubmit={formikMagzine.handleSubmit}
          className={"magazine-container"}
        >
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>FirstName</p>
            <input
              className={"input-sizes"}
              type={"text"}
              {...formikMagzine.getFieldProps("firstName")}
            />
            {formikMagzine.touched.firstName &&
            formikMagzine.errors.firstName ? (
              <div className="m-error">{formikMagzine.errors.firstName}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>Last Name</p>
            <input
              className={"input-sizes"}
              type={"text"}
              {...formikMagzine.getFieldProps("lastName")}
            />
            {formikMagzine.touched.lastName && formikMagzine.errors.lastName ? (
              <div className="m-error">{formikMagzine.errors.lastName}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>Email</p>
            <input
              className={"input-sizes"}
              type={"email"}
              {...formikMagzine.getFieldProps("email")}
            />
            {formikMagzine.touched.email && formikMagzine.errors.email ? (
              <div className="m-error">{formikMagzine.errors.email}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>Phone Number</p>
            <input
              className={"input-sizes number-input"}
              type={"number"}
              {...formikMagzine.getFieldProps("mobileNumber")}
            />
            {formikMagzine.touched.mobileNumber &&
            formikMagzine.errors.mobileNumber ? (
              <div className="m-error">{formikMagzine.errors.mobileNumber}</div>
            ) : null}
          </div>
          <div className={"street-align"}>
            <p className={"name-heading"}>Street Address</p>
            <input
              className={"input-sizes"}
              type={"text"}
              {...formikMagzine.getFieldProps("address")}
            />
            {formikMagzine.touched.address && formikMagzine.errors.address ? (
              <div className="m-error">{formikMagzine.errors.address}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>Postal/Zip code</p>
            <input
              className={"input-sizes number-input"}
              type={"number"}
              {...formikMagzine.getFieldProps("postalCode")}
            />
            {formikMagzine.touched.postalCode &&
            formikMagzine.errors.postalCode ? (
              <div className="m-error">{formikMagzine.errors.postalCode}</div>
            ) : null}
          </div>
          <div className={"magazine-input-container"}>
            <p className={"name-heading"}>State</p>
            <div className={"input-sizes"}>
              <select
                className="set-up"
                value={selectedState}
                onChange={handleSelect}
              >
                <option value="">--Select a state--</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="btn-submit-align">
            <button type="submit" className="button-submit btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default MagazineForm;