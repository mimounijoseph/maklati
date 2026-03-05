import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

type Category  = {
  id:string,
  name:string
}

export class CategoryService {
  constructor() {}

  // Get all unique categories from "plat" collection
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categories: Category[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      return categories; // e.g. ["Pizza", "Sandwich", "Dessert"]
    } catch (error) {
      console.error("Error getting categories: ", error);
      throw error;
    }
  }
}
