import React from "react";
import { FaLock } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { changePasswordAPI } from "../../services/users/userService";
import { logoutAction } from "../../redux/slice/authSlice";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(5, "Password must be at least 5 characters long")
    .required("Password is required"),
});

const UpdatePassword = () => {
  const dispatch = useDispatch();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: changePasswordAPI,
    mutationKey: ["change-password"],
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values.password)
        .then(() => {
          dispatch(logoutAction());
          localStorage.removeItem("userInfo");
        })
        .catch(console.error);
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-md border border-purple-100">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-lg">
        <h2 className="text-xl text-center font-bold text-white">
          Change Password
        </h2>
      </div>

      <div className="p-5">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {isPending && <AlertMessage type="loading" message="Updating..." />}
            {isError && (
              <AlertMessage
                type="error"
                message={
                  error?.response?.data?.message || "Password change failed"
                }
              />
            )}
            {isSuccess && (
              <AlertMessage type="success" message="Password updated" />
            )}
          </div>

          {/* Password Field */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <FaLock className="text-xl text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                New Password *
              </label>
              <input
                {...formik.getFieldProps("password")}
                type="password"
                className={`mt-1 w-full border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-purple-200"
                } bg-purple-50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Enter new password"
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-xs text-red-500">
                  {formik.errors.password}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 rounded-md transition-all duration-300"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
