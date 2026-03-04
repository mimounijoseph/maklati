import { Snack } from "@/interfaces/snack";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
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
      const q = query(snackRef, where("ownerUID", "==", ownerId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        return {
          id: firstDoc.id,
          ...firstDoc.data(),
        };
      }
    } catch (error) {
      console.error("Error finding snack: ", error);
    }
  }

  async getById(snackId: string) {
    try {
      const snackDoc = await getDoc(doc(db, "snacks", snackId));
      if (!snackDoc.exists()) {
        return null;
      }

      return {
        id: snackDoc.id,
        ...snackDoc.data(),
      };
    } catch (error) {
      console.error("Error finding snack by id: ", error);
      return null;
    }
  }
}
