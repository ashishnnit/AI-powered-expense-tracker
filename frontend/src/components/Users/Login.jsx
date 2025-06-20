import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import { loginAction } from "../../redux/slice/authSlice";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid").required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters long")
    .required("Email is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["login"],
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then((data) => {
          dispatch(loginAction(data));
          localStorage.setItem("userInfo", JSON.stringify(data));
        })
        .catch((e) => console.log(e));
    },
  });
  
  useEffect(() => {
    setTimeout(() => {
      if (isSuccess) {
        navigate("/profile");
      }
    }, 3000);
  }, [isPending, isError, error, isSuccess]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-100 p-4">
      <form 
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-indigo-200 mt-2">Sign in to your account</p>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Status Messages */}
          <div className="space-y-4">
            {isPending && <AlertMessage type="loading" message="Logging you in..." />}
            {isError && <AlertMessage type="error" message={error.response?.data?.message || "Login failed"} />}
            {isSuccess && <AlertMessage type="success" message="Login successful" />}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
          
          {/* Additional Options */}
          <div className="flex items-center justify-between pt-2">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Forgot password?
            </a>
            <a href="#" className="text-sm text-cyan-600 hover:text-cyan-800 font-medium">
              Create account
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;