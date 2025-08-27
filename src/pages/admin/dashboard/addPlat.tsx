import React, {FC,useState} from 'react'
import Sidebar from './sidebar';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase"; // adjust the path
import { Plat } from '@/interfaces/product';
import PexelsSearchModal from '@/components/pexelsSearch';





const AddPlat: FC = () => {

      // 2. Form state
  const [formData, setFormData] = useState<Omit<Plat, "userId" | "createdAt">>({
    id: 0,
    name: "",
    description: "",
    category: "",
    size: "",
    price: 0,
    urlPhoto: "",
  });

  // 3. Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "id" || name === "price" ? Number(value) || 0 : value,
    }));
  };

  // 4. Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add a plat.");
        return;
      }

      const newPlat: Plat = {
        ...formData,
        snackId: user.uid, //todo replace userId by snackId because it's more significant
        createdAt: new Date(),
      };

      await addDoc(collection(db, "plat"), newPlat);

      alert("Plat added successfully!");

      // Reset form
      setFormData({
        id: 0,
        name: "",
        description: "",
        category: "",
        size: "",
        price: 0,
        urlPhoto: "",
      });
    } catch (error) {
      console.error("Error adding plat: ", error);
    }
  };


  return (
    <div style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto"
    >
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* ID */}
        {/* <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            ID
          </label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            required
          />
        </div> */}

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

        {/* Size */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Size
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, category: e.target.value })
                    }
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

        {/* Price */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            required
          />
        </div>

      {/* Pexels Photo Selector */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Photo</label>
        <PexelsSearchModal onSelect={(url) => setFormData({ ...formData, urlPhoto: url })} />
        {formData.urlPhoto && (
          <img src={formData.urlPhoto} alt="Selected" className="mt-2 h-40 rounded-lg" />
        )}
      </div>
      
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
  
  )
}

export default AddPlat;