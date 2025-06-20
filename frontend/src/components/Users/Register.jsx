import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirming your password is required"),
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register"],
  });
  
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then((data) => console.log(data))
        .catch((e) => console.log(e));
    },
  });
  
  useEffect(() => {
    setTimeout(() => {
      if (isSuccess) navigate("/login");
    }, 3000);
  }, [isPending, isError, error, isSuccess]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-100 p-4">
      <form 
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-indigo-200 mt-2">Join our community today</p>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Status Messages */}
          <div className="space-y-4">
            {isPending && <AlertMessage type="loading" message="Creating your account..." />}
            {isError && <AlertMessage type="error" message={error.response?.data?.message || "Registration failed"} />}
            {isSuccess && <AlertMessage type="success" message="Registration successful!" />}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                id="username"
                type="text"
                {...formik.getFieldProps("username")}
                className="block w-full pl-10 pr-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                placeholder="Your username"
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm text-rose-500 mt-1">{formik.errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className="block w-full pl-10 pr-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-rose-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                className="block w-full pl-10 pr-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-rose-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                className="block w-full pl-10 pr-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-sm text-rose-500 mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
          >
            {isPending ? 'Creating account...' : 'Register'}
          </button>
          
          {/* Additional Options */}
          <div className="flex items-center justify-center pt-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;