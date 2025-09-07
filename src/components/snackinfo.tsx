"use client";
import React, { FC, useEffect, useState } from "react";

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

      <div className="">
        <Card className=" mx-auto shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Snack Information</h2>

          <div className="space-y-4">
            {/* Snack Image */}
            {/* {snack?.image && (
              <div className="flex justify-center mb-6">
                <img
                  src={snack.image}
                  alt="Snack"
                  className="rounded-xl shadow-lg max-h-60"
                />
              </div>
            )} */}

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
                <Spinner size="sm" light={true} />
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
  );
};

export default SnackInfo;
