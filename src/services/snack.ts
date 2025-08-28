import { Snack } from "@/interfaces/snack";
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
export class SnackService {
  constructor() {}

  async getAll() {
    try {
      const snackRef = collection(db, "snacks");
      const querySnapshot = await getDocs(snackRef);

      if (!querySnapshot.empty) {
        const snacks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return snacks;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting snacks: ", error);
      throw error;
    }
  }

  async save(snack: Snack) {
    try {
      const snackRef = collection(db, "snacks");
      const newSnack = {
        ...snack,
      };
      await addDoc(snackRef, newSnack);
    } catch (error) {
      console.error("Error saving snack:", error);
    }
  }

  async getByOwnerId(ownerId: any) {
    try {
      const snackRef = collection(db, "snacks");
      const q = query(snackRef, where("userUID", "==", ownerId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
    } catch (error) {
      console.error("Error finding snack: ", error);
    }
  }
}
