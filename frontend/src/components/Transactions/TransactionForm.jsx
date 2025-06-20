import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";


import {
  FaDollarSign,
  FaCalendarAlt,
  FaRegCommentDots,
  FaWallet,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { listCategoriesAPI } from "../../services/category/categoryService";
import { addTransactionAPI } from "../../services/transactions/transactionService";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  type: Yup.string()
    .required("Transaction type is required")
    .oneOf(["income", "expense"]),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  category: Yup.string().required("Category is required"),
  date: Yup.date().required("Date is required"),
  description: Yup.string(),
});

const TransactionForm = () => {
  const navigate = useNavigate();
  
  const {
    mutateAsync,
    isPending,
    isError: isAddTranErr,
    error: transErr,
    isSuccess,
  } = useMutation({
    mutationFn: addTransactionAPI,
    mutationKey: ["add-transaction"],
  });
  
  const { 
    data, 
    isError, 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const formik = useFormik({
    initialValues: {
      type: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values) .then(() => navigate("/dashboard"))
      .catch(console.error);

    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-t-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-purple-500 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <h2 className="text-xl font-bold">Add Transaction</h2>
            <div className="w-8"></div>
          </div>
          <p className="text-center text-purple-200 text-sm mt-1">
            {formik.values.type === "income" 
              ? "Add money received" 
              : formik.values.type === "expense" 
                ? "Record money spent" 
                : "Track your finances"}
          </p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Alert Messages */}
            <div className="space-y-3">
              {isError && (
                <AlertMessage
                  type="error"
                  message={
                    error?.response?.data?.message ||
                    "Failed to load categories"
                  }
                />
              )}
              {isAddTranErr && (
                <AlertMessage
                  type="error"
                  message={
                    transErr?.response?.data?.message ||
                    "Failed to add transaction"
                  }
                />
              )}
              {isSuccess && (
                <AlertMessage 
                  type="success" 
                  message="Transaction added!" 
                />
              )}
            </div>

            {/* Type and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Type Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  <div className="flex items-center">
                    <FaWallet className="mr-1 text-purple-500 text-base" />
                    Type
                  </div>
                </label>
                <div className="relative">
                  <select
                    {...formik.getFieldProps("type")}
                    className={`w-full py-3 pl-10 pr-3 bg-purple-50 rounded-lg border ${
                      formik.touched.type && formik.errors.type
                        ? "border-red-500"
                        : "border-purple-200"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-base`}
                  >
                    <option value="">Select type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <FaWallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-base" />
                </div>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.type}</p>
                )}
              </div>

              {/* Amount Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  <div className="flex items-center">
                    <FaDollarSign className="mr-1 text-purple-500 text-base" />
                    Amount
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...formik.getFieldProps("amount")}
                    placeholder="0.00"
                    className={`w-full py-3 pl-10 pr-3 bg-purple-50 rounded-lg border ${
                      formik.touched.amount && formik.errors.amount
                        ? "border-red-500"
                        : "border-purple-200"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-base`}
                  />
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-base" />
                </div>
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
                )}
              </div>
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  <div className="flex items-center">
                    <FaRegCommentDots className="mr-1 text-purple-500 text-base" />
                    Category
                  </div>
                </label>
                <div className="relative">
                  <select
                    {...formik.getFieldProps("category")}
                    disabled={isCategoriesLoading}
                    className={`w-full py-3 pl-10 pr-3 bg-purple-50 rounded-lg border ${
                      formik.touched.category && formik.errors.category
                        ? "border-red-500"
                        : "border-purple-200"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-base ${
                      isCategoriesLoading ? "bg-purple-100" : ""
                    }`}
                  >
                    <option value="">Select category</option>
                    {data?.map((category) => (
                      <option key={category?._id} value={category?.name}>
                        {category?.name}
                      </option>
                    ))}
                  </select>
                  <FaRegCommentDots className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-base" />
                </div>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                )}
              </div>

              {/* Date Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-purple-500 text-base" />
                    Date
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...formik.getFieldProps("date")}
                    className={`w-full py-3 pl-10 pr-3 bg-purple-50 rounded-lg border ${
                      formik.touched.date && formik.errors.date
                        ? "border-red-500"
                        : "border-purple-200"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-base`}
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-base" />
                </div>
                {formik.touched.date && formik.errors.date && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">
                <div className="flex items-center">
                  <FaRegCommentDots className="mr-1 text-purple-500 text-base" />
                  Description
                </div>
              </label>
              <textarea
                {...formik.getFieldProps("description")}
                placeholder="Add note (optional)"
                rows="3"
                className="w-full py-3 px-4 bg-purple-50 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-base"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                  isPending
                    ? "bg-purple-400"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                } transition-all duration-300 shadow hover:shadow-md text-base`}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2 text-base" />
                    <span>Add Transaction</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;