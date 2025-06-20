import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWallet } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addCategoryAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  type: Yup.string()
    .required("Category type is required")
    .oneOf(["income", "expense"]),
});

const AddCategory = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: addCategoryAPI,
    mutationKey: ["login"],
  });

  const formik = useFormik({
    initialValues: {
      type: "",
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then(() => navigate("/categories"))
        .catch(console.error);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-t-2xl p-5 text-center">
          <h2 className="text-2xl font-bold text-white">Create New Category</h2>
          <p className="text-purple-200 mt-1 text-sm">Organize your finances with custom categories</p>
        </div>
        
        <div className="bg-white rounded-b-2xl shadow-xl p-6 border border-purple-100">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {isError && (
                <AlertMessage
                  type="error"
                  message={
                    error?.response?.data?.message ||
                    "Something happened please try again later"
                  }
                />
              )}
              {isSuccess && (
                <AlertMessage
                  type="success"
                  message="Category added successfully, redirecting..."
                />
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaWallet className="text-purple-600" />
                  </div>
                  <h3 className="font-medium text-purple-800">Category Type</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Transaction Type
                  </label>
                  <select
                    {...formik.getFieldProps("type")}
                    className="block w-full py-3 px-4 bg-white rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  {formik.touched.type && formik.errors.type && (
                    <p className="text-sm text-rose-500 mt-1">{formik.errors.type}</p>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <SiDatabricks className="text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-indigo-800">Category Details</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    placeholder="Enter category name"
                    className="block w-full py-3 px-4 bg-white rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-rose-500 mt-1">{formik.errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition duration-300 disabled:opacity-70"
              >
                {isPending ? 'Adding...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;