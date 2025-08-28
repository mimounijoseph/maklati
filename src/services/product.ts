import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
export class ProductService {
  constructor() {}

  async getAll() {
    try {
      const productsRef = collection(db, "plat");
      const querySnapshot = await getDocs(productsRef);

      if (!querySnapshot.empty) {
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting snacks: ", error);
      throw error;
    }
  }

  async save(product: any) {
    try {
      const productsRef = collection(db, "plat");
      await addDoc(productsRef, product);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  async getBySnackId(snackId: any) {
    try {
      const productsRef = collection(db, "plat");
      const q = query(productsRef, where("snackId", "==", snackId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return products;
      }
    } catch (error) {
      console.error("Error finding products: ", error);
    }
  }
}
