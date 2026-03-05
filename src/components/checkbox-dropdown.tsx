import React, { useState } from "react";

export default function CheckboxDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const menuItems = [
    "product variant 1",
    "product variant 2",
    "product variant 3",
    "product variant 4",
    "product variant 5",
   
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = () => {
    console.log("Confirmed:", selectedItems);
    setIsOpen(false); // close dropdown
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
        focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 text-center inline-flex items-center"
        type="button"
      >
        Choose variant
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-[9999] bg-white rounded-lg shadow-sm w-60 dark:bg-gray-700">
          <div className="p-3">
            <input
              type="text"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border 
              border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 
              focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 
              dark:placeholder-gray-400 dark:text-white"
              placeholder="Search snacks"
            />
          </div>
          <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
            {menuItems.map((item) => (
              <li key={item}>
                <div className="flex items-center ps-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    id={`checkbox-${item}`}
                    checked={selectedItems.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                    rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 
                    dark:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`checkbox-${item}`}
                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300"
                  >
                    {item}
                  </label>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer with confirm button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
              Selected: {selectedItems.length > 0 ? selectedItems.join(", ") : "None"}
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-700 text-white py-2 px-3 rounded-lg hover:bg-blue-800"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
