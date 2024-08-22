import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Axiosconfig/Axiosconfig";
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from "../store/slices/userSlice";


const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const { user } = useSelector((state: any) => state.user);
  useEffect(()=>{
    console.log(user,'....');
    
  },[user])

  const initialValues = {
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    street: user.address?.[0]?.street || "",
    city: user.address?.[0]?.city || "",
    state: user.address?.[0]?.state || "",
    zipCode: user.address?.[0]?.zipCode || "",
    skills: user.skills || "",
    education: user.education || "",
    specification: user.specification || "",
    role: user.role || "",
    image: user.image || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be between 3 and 15 characters")
      .max(15, "Name must be between 3 and 15 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name cannot contain numbers or special characters")
      .required("Name is required"),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9_]+@gmail\.com$/, "Valid email is required")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid mobile number format. Must start with a digit from 6 to 9 and be 10 digits long")
      .required("Mobile number is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string()
      .matches(/^\d{5,6}$/, "Valid Zip Code is required")
      .required("Zip Code is required"),
    skills: Yup.string().required("Skills are required"),
    education: Yup.string().required("Education is required"),
    specification: Yup.string().required("Specification is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await axiosInstance.put("/api/auth/updateProfile", values);
      if (response.data.data) {
        toast.success("Successfully Updated");
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(setUser(response.data.data));
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the profile");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">{initialValues.role}-Profile</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors }) => (
            <Form>
              <div className="grid gap-6 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-1 flex flex-col items-center">
                  <p className="font-medium text-lg text-gray-800">Personal Details</p>
                  <div className="relative mt-4">
                  <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
                    <img
                      src={`http://localhost:8080/src/uploads/${initialValues.image}`}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 text-sm grid-cols-1 md:grid-cols-2">
                  <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="name">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.name ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your name"
                      />
                      <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="email">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.email ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your email"
                        readOnly
                      />
                      <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="mobile">
                        Mobile
                      </label>
                      <Field
                        type="text"
                        name="mobile"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.mobile ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your mobile number"
                      />
                      <ErrorMessage name="mobile" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="street">
                      Street
                      </label>
                      <Field
                        type="text"
                        name="street"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.address ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your street"
                      />
                      <ErrorMessage name="street" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="city">
                        City
                      </label>
                      <Field
                        type="text"
                        name="city"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.city ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your city"
                      />
                      <ErrorMessage name="city" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="state">
                        State
                      </label>
                      <Field
                        type="text"
                        name="state"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.state ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your state"
                      />
                      <ErrorMessage name="state" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-slate-500" htmlFor="zipCode">
                        Zip Code
                      </label>
                      <Field
                        type="text"
                        name="zipCode"
                        className={`h-10 border mt-1 rounded px-4 w-full ${
                          errors.zipCode ? "border-red-500" : "bg-gray-50"
                        }`}
                        placeholder="Enter your zip code"
                      />
                      <ErrorMessage name="zipCode" component="p" className="text-red-500 text-xs" />
                    </div>

                    
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none"
                      onClick={() => navigate("/userProfile")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none disabled:bg-gray-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;