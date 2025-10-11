"use client";

import React, { FC, useEffect, useState } from "react";
import Sidebar from "../../sidebar"; // adjust if needed
import { useParams } from "next/navigation";
import { collection, doc, getDoc, updateDoc,getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import  { useRouter } from "next/router";
import { Plat } from "@/interfaces/product";
import PexelsSearchModal from "@/components/pexelsSearch";
import Spinner from "@/components/spinner";
import { CategoryService } from "@/services/CategoryService";


type Category  = {
  id:string,
  name:string
}

const EditPlat: FC = () => {
  const router = useRouter();
  const { docId } = router.query;

  const [formData, setFormData] = useState<Omit<Plat, "userId" | "createdAt">>({
    id: 0,
    name: "",
    description: "",
    status: true,
    category: "",
    cost: [],
    urlPhoto: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

   const categoryService = new CategoryService();
  



  // ✅ Fetch plat by docId
  useEffect(() => {
    
          const fetchCategories = async () => {
          const querySnapshot = await getDocs(collection(db, "categories"));
          const cats: Category[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Category[];
          setCategories(cats);
        };
    
        fetchCategories();


    const fetchPlat = async () => {
      try {
        if (!docId) return;
        const docRef = doc(db, "plat", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Plat;
          console.log(data);
          setFormData({
            id: data.id || 0,
            name: data.name || "",
            description: data.description || "",
            status: data.status ?? true,
            category: data.category || "",
            cost: data.cost || [],
            urlPhoto: data.urlPhoto || "",
          });
        } else {
          console.error("Plat not found");
        }
      } catch (error) {
        console.error("Error fetching plat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlat();
  }, [docId]);

  // ✅ Handlers (same as AddPlat)
  const addCostRow = () => {
    setFormData((prev) => ({
      ...prev,
      cost: [...prev.cost, { size: "", price: 0, quantity: 0 }],
    }));
  };

  const handleCostChange = (index: number, field: string, value: string | number) => {
    const updatedCost = [...formData.cost];
    updatedCost[index] = {
      ...updatedCost[index],
      [field]: field === "price" || field === "quantity" ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, cost: updatedCost }));
  };

  const removeCostRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cost: prev.cost.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "id" ? Number(value) || 0 : value,
    }));
  };

  // ✅ Update Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docId) return;

    try {
      setSaving(true);
      const docRef = doc(db, "plat", docId as string);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date(),
      });

      setSaving(false);
      setShowPopup(true);

      // Auto-hide popup
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error updating plat: ", error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin min-h-screen bg-gray-50" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Sidebar />
      <div className="p-6 sm:ml-64">
        <div className="mt-14">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Edit Plat</h1>
            <p className="text-gray-500 text-sm">Update the details of this plat.</p>
          </div>
          <div className="flex justify-center p-8 space-y-8 max-w-4xl mx-auto relative">
        <Spinner />
          </div>
        
      </div>
      </div>
    </div>
    );
  }

  return (
    <div className="admin min-h-screen bg-gray-50" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Sidebar />
      <div className="p-6 sm:ml-64">
        <div className="mt-14">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Edit Plat</h1>
            <p className="text-gray-500 text-sm">Update the details of this plat.</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8 max-w-4xl mx-auto relative"
          >
            {/* Basic Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  required
                >
                  <option value="">Select category</option>
                      {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Dynamic Sizes & Prices */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">Sizes & Prices</label>
              <div className="space-y-3 text-gray-900">
                {formData.cost.map((c, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl"
                  >
                    <input
                      type="text"
                      placeholder="Size (e.g. XL)"
                      value={c.size}
                      onChange={(e) => handleCostChange(index, "size", e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={c.price}
                      onChange={(e) => handleCostChange(index, "price", e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeCostRow(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCostRow}
                className="mt-3 text-blue-600 hover:underline text-sm font-medium"
              >
                + Add Size
              </button>
            </div>

            {/* Photo Selector */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Photo</label>
              <PexelsSearchModal onSelect={(url) => setFormData({ ...formData, urlPhoto: url })} />
              {formData.urlPhoto && (
                <div className="mt-4">
                  <img
                    src={formData.urlPhoto}
                    alt="Selected"
                    className="h-48 rounded-xl shadow-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-md transition flex items-center gap-2"
              >
                {saving && <Spinner />}
                Update Plat
              </button>
            </div>

            {/* Popup */}
            {showPopup && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition">
                Plat updated successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlat;
