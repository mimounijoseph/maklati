"use client";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import { Spinner } from "flowbite-react";

type Snack = {
  name: string;
  description: string;
  phone: string;
  address: string;
  image: string;
};

const SnackInfo: FC = () => {
  const [snack, setSnack] = useState<Snack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const snackId = "vczKVef8tEekpksTaNbE"; // hardcoded for now

  useEffect(() => {
    const fetchSnack = async () => {
      try {
        const docRef = doc(db, "snacks", snackId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSnack(docSnap.data() as Snack);
        }
      } catch (err) {
        console.error("Error fetching snack:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnack();
  }, []);

  const handleUpdate = async () => {
    if (!snack) return;
    setSaving(true);
    try {
      const docRef = doc(db, "snacks", snackId);
      await updateDoc(docRef, snack);
      alert("Snack info updated successfully ✅");
    } catch (err) {
      console.error("Error updating snack:", err);
      alert("Failed to update snack ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="admin bg-gray-50 min-h-screen" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="p-6 sm:ml-64">
        <Card className="max-w-3xl mx-auto shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Snack Information</h2>

          <div className="space-y-4">
            {/* Snack Image */}
            {snack?.image && (
              <div className="flex justify-center mb-6">
                <img
                  src={snack.image}
                  alt="Snack"
                  className="rounded-xl shadow-lg max-h-60"
                />
              </div>
            )}

            {/* Name */}
            <div>
              <Label htmlFor="name" />
              <TextInput
                id="name"
                value={snack?.name || ""}
                onChange={(e) => setSnack({ ...snack!, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description"  />
              <Textarea
                id="description"
                value={snack?.description || ""}
                onChange={(e) =>
                  setSnack({ ...snack!, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone"  />
              <TextInput
                id="phone"
                value={snack?.phone || ""}
                onChange={(e) => setSnack({ ...snack!, phone: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address"  />
              <TextInput
                id="address"
                value={snack?.address || ""}
                onChange={(e) => setSnack({ ...snack!, address: e.target.value })}
                required
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
            <Button
            onClick={handleUpdate}
            color="green"
            disabled={saving}
            >
            {saving ? (
                <div className="flex items-center gap-2">
                <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-2 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 
                    100.591C22.3858 100.591 0 78.2051 0 
                    50.5908C0 22.9766 22.3858 0.59082 
                    50 0.59082C77.6142 0.59082 100 
                    22.9766 100 50.5908ZM9.08144 
                    50.5908C9.08144 73.1895 27.4013 
                    91.5094 50 91.5094C72.5987 
                    91.5094 90.9186 73.1895 90.9186 
                    50.5908C90.9186 27.9921 72.5987 
                    9.67226 50 9.67226C27.4013 
                    9.67226 9.08144 27.9921 
                    9.08144 50.5908Z"
                    fill="#E5E7EB"
                    />
                    <path
                    d="M93.9676 39.0409C96.393 
                    38.4038 97.8624 35.9116 
                    97.0079 33.5539C95.2932 
                    28.8227 92.871 24.3692 
                    89.8167 20.348C85.8452 
                    15.1192 80.8826 10.7238 
                    75.2124 7.41289C69.5422 
                    4.10194 63.2754 1.94025 
                    56.7698 1.05124C51.7666 
                    0.367541 46.6976 0.446843 
                    41.7345 1.27873C39.2613 
                    1.69328 37.813 
                    4.19778 38.4501 
                    6.62326C39.0873 
                    9.04874 41.5694 
                    10.4717 44.0505 
                    10.1071C47.8511 
                    9.54855 51.7191 
                    9.52689 55.5402 
                    10.1276C60.8642 
                    10.861 65.9928 
                    12.669 70.6331 
                    15.4986C75.2735 
                    18.3277 79.2876 
                    21.6972 82.7729 
                    25.9931C84.9175 
                    28.9121 86.7997 
                    32.6556 88.2143 
                    36.6117C89.083 38.9849 
                    91.5421 39.6781 93.9676 
                    39.0409Z"
                    fill="currentColor"
                    />
                </svg>
                Saving...
                </div>
            ) : (
                "Save Changes"
            )}
            </Button>

            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SnackInfo;
