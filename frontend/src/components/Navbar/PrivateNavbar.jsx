import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";
import { SiAuthy } from "react-icons/si";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("userInfo");
  };

  return (
    <Disclosure as="nav" className="bg-gray-50 shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center w-full">
                <div className="md:hidden mr-2">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex items-center text-green-600 font-semibold mr-6">
                  <SiAuthy className="h-8 w-auto" />
                  <span className="ml-2 text-lg">MasyncTracker</span>
                </div>
                <div className="hidden md:flex space-x-6">
                  {[
                    { name: "Add Transaction", path: "/add-transaction" },
                    { name: "Add Category", path: "/add-category" },
                    { name: "Categories", path: "/categories" },
                    { name: "Profile", path: "/profile" },
                    { name: "Dashboard", path: "/dashboard" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-700 hover:text-indigo-600 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={logoutHandler}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"
                >
                  <IoLogOutOutline className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden bg-gray-50 px-4 pt-2 pb-3 space-y-1">
            {[
              { name: "Add Transaction", path: "/add-transaction" },
              { name: "Add Category", path: "/add-category" },
              { name: "Categories", path: "/categories" },
              { name: "Profile", path: "/profile" },
              { name: "Dashboard", path: "/dashboard" },
            ].map((item) => (
              <Link key={item.name} to={item.path}>
                <Disclosure.Button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-base font-medium">
                  {item.name}
                </Disclosure.Button>
              </Link>
            ))}
            <Disclosure.Button
              onClick={logoutHandler}
              className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 rounded-md text-base font-medium"
            >
              Logout
            </Disclosure.Button>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
