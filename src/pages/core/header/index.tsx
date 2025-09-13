import ThemeSwitchIcon from "@/components/theme-switch-icon";
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "../../../context/useContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Currency, useCurrency } from "@/context/currencyContext";
import Select from "react-select";

const options = [
  {
    value: "USD",
    label: "USD - $",
    flag: "https://flagcdn.com/us.svg",
  },
  {
    value: "EUR",
    label: "EUR - €",
    flag: "https://flagcdn.com/eu.svg",
  },
  {
    value: "MAD",
    label: "MAD - د.م",
    flag: "https://flagcdn.com/ma.svg",
  },
];

function Header() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { currency, setCurrency } = useCurrency();
  function showToast(
    title: string,
    message: string,
    variant:
      | "success"
      | "default"
      | "destructive"
      | "warning"
      | "info"
      | undefined
  ) {
    toast({
      title: title,
      description: message,
      variant: variant,
      duration: 2000,
    });
  }

  const logout = async () => {
    await signOut(auth);
    showToast("success !", "You're logged out", "success");
  };

  useEffect(() => {}, [user]);

  return (
    <div>
      <nav className="border-gray-200 bg-transparent">
        <div className="flex flex-wrap items-center justify-between flex-shrink-0 max-w-screen-xl mx-auto p-4">
          {/* <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse"> */}
          {/* <img src="logo.png" width="140px" alt="maklati Logo" /> */}
          <a
            href="/"
            className="text-3xl font-bold"
            style={{ color: "#FF9B00", fontFamily: "Sacramento" }}
          >
            maklati
          </a>
          {/* </a> */}
          <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
            {/* {user ? (
              <>
                <a
                  href="/auth/login"
                  className="text-white hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
                  onClick={logout}
                >
                  Logout
                </a>
                <div className="flex gap-2 items-center">
                  <p className="text-lg font-normal text-sm text-amber-600">
                    {user.displayName}
                  </p>
                  <img
                    src={user?.photoURL as string}
                    alt="profile"
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </div>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-white hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="text-white hover:bg-amber-600 focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5  focus:outline-none "
                >
                  Sign up
                </a>
              </>
            )} */}

            {/* <ThemeSwitchIcon/> */}

            <button
              data-collapse-toggle="mega-menu"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
              aria-controls="mega-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            id="mega-menu"
            className="items-center  hidden w-full md:flex md:w-auto md:order-2"
          >
            <ul className="flex flex-col md:items-center mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-white   border-b border-gray-100  hover:text-amber-600 md:border-0  md:p-0  "
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                {/* <button id="mega-menu-dropdown-button" data-dropdown-toggle="mega-menu-dropdown" className="flex items-center justify-between w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"> */}
                <a
                  href="/snack"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600  md:border-0  md:p-0      "
                >
                  Snacks
                </a>
                {/* Menu  */}
                {/* <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"> */}
                {/* <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/> */}
                {/* </svg> */}
                {/* </button> */}
                {/* <div id="mega-menu-dropdown" className="absolute z-10 grid hidden w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-3 dark:bg-gray-700">
                        <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
                            <ul className="space-y-4" aria-labelledby="mega-menu-dropdown-button">
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Library
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Resources
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Pro Version
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Newsletter
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Playground
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        License
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Support Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div> */}
              </li>
              {/* <li> */}
              {/* <a href="#" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">Team</a> */}
              {/* </li> */}
              <li>
                <a
                  href="/about"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600  md:border-0  md:p-0"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600  md:border-0  md:p-0"
                >
                  Contact
                </a>
              </li>
              {user ? (
                <>
                  <li className="text-center mt-10 mb-5 md:ms-24 md:mb-0 md:mt-0">
                    <a
                      href="/auth/login"
                      className="text-white bg-amber-600 md:bg-transparent hover:bg-amber-600  focus:ring-4 font-medium rounded-lg text-sm px-14  py-2 md:px-5 md:py-2.5 focus:outline-none"
                      onClick={logout}
                    >
                      Logout
                    </a>
                  </li>
                  <li>
                    <div className="flex justify-center gap-2 items-center w-fit m-auto md:mt-2">
                      <p className="font-normal text-sm text-amber-600">
                        {user.displayName}
                      </p>
                      <img
                        src={user?.photoURL as string}
                        alt="profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="md:ms-24">
                    <a
                      href="/auth/login"
                      className="text-white hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/register"
                      className="text-white hover:bg-amber-600 focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5  focus:outline-none "
                    >
                      Sign up
                    </a>
                  </li>
                </>
              )}
<li>
<Select
      value={options.find((o) => o.value === currency)}
      onChange={(opt:any) => setCurrency(opt?.value)}
      options={options}
      formatOptionLabel={(option) => (
        <div className="flex items-center gap-2 text-black" style={{fontFamily: 'sans-serif'}}>
          <img src={option.flag} alt={option.value} className="w-5 h-4 rounded-sm" />
          <span>{option.label}</span>
        </div>
      )}
      className="w-44"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          padding: "2px",
          color:'black'
        }),
      }}
    />
</li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
