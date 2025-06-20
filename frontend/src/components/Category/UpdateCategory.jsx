import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWallet } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { updateCategoryAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  type: Yup.string()
    .required("Category type is required")
    .oneOf(["income", "expense"]),
});

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: updateCategoryAPI,
    mutationKey: ["update-category"],
  });

  const formik = useFormik({
    initialValues: {
      type: "",
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync({ ...values, id })
        .then(() => navigate("/categories"))
        .catch(console.error);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-t-2xl p-5 text-white">
          <h2 className="text-2xl font-bold text-center">Update Category</h2>
          <p className="text-purple-200 text-sm text-center mt-2">
            Modify your category details
          </p>
        </div>
        
        <div className="bg-white rounded-b-2xl shadow-xl p-5">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="space-y-3">
              {isError && (
                <AlertMessage
                  type="error"
                  message={
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again."
                  }
                />
              )}
              {isSuccess && (
                <AlertMessage
                  type="success"
                  message="Category updated successfully!"
                />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaWallet className="text-purple-500" />
                Type
              </label>
              <div className="relative">
                <select
                  {...formik.getFieldProps("type")}
                  id="type"
                  className={`block w-full pl-3 pr-4 py-2.5 bg-purple-50 rounded-lg border ${
                    formik.touched.type && formik.errors.type
                      ? "border-red-500"
                      : "border-purple-200"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition text-sm`}
                >
                  <option value="">Select transaction type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SiDatabricks className="text-purple-500" />
                Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                placeholder="Category name"
                id="name"
                className={`block w-full pl-3 pr-4 py-2.5 bg-purple-50 rounded-lg border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-purple-200"
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition text-sm`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-2.5 px-4 rounded-lg text-white font-medium ${
                isPending
                  ? "bg-purple-400"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              } transition-all duration-300 shadow hover:shadow-md`}
            >
              {isPending ? "Updating..." : "Update Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;