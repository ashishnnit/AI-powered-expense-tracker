import React, { useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteCategoryAPI,
  listCategoriesAPI,
} from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const CategoriesList = () => {
  const navigate = useNavigate();

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const {
    mutateAsync,
    isPending,
    error: categoryErr,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: deleteCategoryAPI,
    mutationKey: ["delete-category"],
  });

  const handleDelete = async (id) => {
    try {
      await mutateAsync(id);
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  // Automatically hide success message after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  return (
    <div className="max-w-2xl mx-auto my-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-xl font-bold">Manage Categories</h2>
            <Link
              to="/add-category"
              className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
            >
              <FaPlus />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {isError && (
            <AlertMessage
              type="error"
              message={error?.response?.data?.message || "Failed to load categories"}
            />
          )}

          {categoryErr && (
            <AlertMessage
              type="error"
              message={categoryErr?.response?.data?.message || "Failed to delete category"}
            />
          )}

          {isSuccess && (
            <AlertMessage type="success" message="Category deleted successfully!" />
          )}

          {data?.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">
                Create your first category to get started
              </p>
              <Link
                to="/add-category"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Category
              </Link>
            </div>
          )}

          {data?.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm text-gray-500 font-medium border-b pb-2">
                <div>Category</div>
                <div className="text-center">Type</div>
                <div className="text-right">Actions</div>
              </div>

              {data?.map((category) => (
                <div
                  key={category?._id}
                  className="grid grid-cols-3 items-center py-3 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-800 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        category.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    {category?.name}
                  </div>

                  <div className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        category.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category?.type?.charAt(0).toUpperCase() +
                        category?.type?.slice(1)}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Link to={`/update-category/${category._id}`}>
                      <button className="p-2 rounded-full hover:bg-gray-100 text-indigo-600">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category?._id)}
                      className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
