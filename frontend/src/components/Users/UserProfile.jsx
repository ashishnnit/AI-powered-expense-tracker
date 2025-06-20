import React from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import UpdatePassword from "./UpdatePassword";
import { updateProfileAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import * as Yup from "yup";

// Validation schema for profile form
const profileValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const UserProfile = () => {
  // Mutation
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: updateProfileAPI,
    mutationKey: ["update-profile"],
  });
  
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      mutateAsync(values).catch(console.error);
    },
  });
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Profile Update Form */}
      <div className="bg-white rounded-lg shadow-md border border-purple-100 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-lg">
          <h1 className="text-xl text-center font-bold text-white">
            Update Profile
          </h1>
        </div>
        
        <div className="p-5">
          {isPending && <AlertMessage type="loading" message="Updating..." />}
          {isError && (
            <AlertMessage type="error" message={error?.response?.data?.message || "Update failed"} />
          )}
          {isSuccess && (
            <AlertMessage type="success" message="Profile updated" />
          )}
          
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <FaUserCircle className="text-xl text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  {...formik.getFieldProps("username")}
                  type="text"
                  className={`mt-1 w-full border ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-500"
                      : "border-purple-200"
                  } bg-purple-50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Your username"
                />
                {formik.touched.username && formik.errors.username && (
                  <span className="text-xs text-red-500">
                    {formik.errors.username}
                  </span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <FaEnvelope className="text-xl text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  className={`mt-1 w-full border ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-purple-200"
                  } bg-purple-50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-xs text-red-500">
                    {formik.errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 rounded-md transition-all duration-300"
                >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Password Update Form */}
      <UpdatePassword />
    </div>
  );
};

export default UserProfile;