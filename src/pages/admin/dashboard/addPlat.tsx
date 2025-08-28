import React, { FC, useState } from "react";
import Sidebar from "./sidebar";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase"; 
import { Plat } from "@/interfaces/product";
import PexelsSearchModal from "@/components/pexelsSearch";

const AddPlat: FC = () => {
  // Updated form state
  const [formData, setFormData] = useState<Omit<Plat, "userId" | "createdAt">>({
    id: 0,
    name: "",
    description: "",
    status: true,
    category: "",
    cost: [], // Array of { size, price, quantity }
    urlPhoto: "",
  });

  // Add a new size-price row
  const addCostRow = () => {
    setFormData((prev) => ({
      ...prev,
      cost: [...prev.cost, { size: "", price: 0, quantity: 0 }],
    }));
  };

  // Update a specific size-price row
  const handleCostChange = (index: number, field: string, value: string | number) => {
    const updatedCost = [...formData.cost];
    updatedCost[index] = {
      ...updatedCost[index],
      [field]: field === "price" || field === "quantity" ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, cost: updatedCost }));
  };

  // Remove a row
  const removeCostRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cost: prev.cost.filter((_, i) => i !== index),
    }));
  };

  // Handle text input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "id" ? Number(value) || 0 : value,
    }));
  };

  // Submit to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add a plat.");
        return;
      }

      const newPlat = {
        ...formData,
        snackId: user.uid, //todo replace userId by snackId because it's more significant
        createdAt: new Date(),
      };

      await addDoc(collection(db, "plat"), newPlat);

      alert("Plat added successfully!");

      setFormData({
        id: 0,
        name: "",
        description: "",
        status: true,
        category: "",
        cost: [],
        urlPhoto: "",
      });
    } catch (error) {
      console.error("Error adding plat: ", error);
    }
  };

  return (
    <div className="h-full bg-white" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="dark:border-gray-700 mt-14">
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-lg shadow-md mx-auto"
          >
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                >
                  <option value="">Select category</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="main_courses">Main Courses</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                  <option value="pizzas">Pizzas</option>
                  <option value="burgers">Burgers</option>
                  <option value="sandwiches">Sandwiches</option>
                  <option value="pastas">Pastas</option>
                  <option value="salads">Salads</option>
                  <option value="soups">Soups</option>
                  <option value="grills">Grills & BBQ</option>
                </select>
              </div>
            </div>

            {/* Dynamic Cost Rows */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Sizes & Prices
              </label>
              {formData.cost.map((c, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Size (e.g. XL)"
                    value={c.size}
                    onChange={(e) =>
                      handleCostChange(index, "size", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-1/3"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={c.price}
                    onChange={(e) =>
                      handleCostChange(index, "price", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-1/3"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={c.quantity}
                    onChange={(e) =>
                      handleCostChange(index, "quantity", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-1/3"
                  />
                  <button
                    type="button"
                    onClick={() => removeCostRow(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addCostRow}
                className="mt-2 text-blue-600 hover:underline"
              >
                + Add Size
              </button>
            </div>

            {/* Pexels Photo Selector */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Photo</label>
              <PexelsSearchModal
                onSelect={(url) => setFormData({ ...formData, urlPhoto: url })}
              />
              {formData.urlPhoto && (
                <img
                  src={formData.urlPhoto}
                  alt="Selected"
                  className="mt-2 h-40 rounded-lg"
                />
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5"
            >
              Add Plat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlat;
