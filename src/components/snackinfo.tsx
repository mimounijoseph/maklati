"use client";

import React, { FC, useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { ImagePlus, Link2, UploadCloud } from "lucide-react";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/useContext";
import { deleteImageFileByUrl, uploadImageFile } from "@/utils/uploadImage";

type Snack = {
  name: string;
  description: string;
  phone: string;
  address: string;
  image: string;
  ownerUID: string;
};

type SnackInfoProps = {
  onSnackChange?: (snackDocId: string | null) => void;
};

const buildEmptySnack = (ownerUID: string): Snack => ({
  name: "",
  description: "",
  phone: "",
  address: "",
  image: "",
  ownerUID,
});

const SnackInfo: FC<SnackInfoProps> = ({ onSnackChange }) => {
  const { user } = useAuth();
  const [snackDocId, setSnackDocId] = useState<string | null>(null);
  const [snack, setSnack] = useState<Snack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [persistedImage, setPersistedImage] = useState<string>("");

  useEffect(() => {
    const fetchSnack = async () => {
      if (!user?.uid) {
        setSnack(null);
        setSnackDocId(null);
        onSnackChange?.(null);
        setLoading(false);
        return;
      }

      try {
        const snackQuery = query(collection(db, "snacks"), where("ownerUID", "==", user.uid));
        const snackSnapshot = await getDocs(snackQuery);

        if (!snackSnapshot.empty) {
          const first = snackSnapshot.docs[0];
          setSnackDocId(first.id);
          setSnack({ ...(first.data() as Snack), ownerUID: user.uid });
          setPersistedImage((first.data() as Snack).image || "");
          onSnackChange?.(first.id);
        } else {
          setSnackDocId(null);
          setSnack(buildEmptySnack(user.uid));
          setPersistedImage("");
          onSnackChange?.(null);
        }
      } catch (err) {
        console.error("Error fetching snack:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnack();
  }, [onSnackChange, user?.uid]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !snack) return;

    try {
      setUploadingImage(true);
      const url = await uploadImageFile(file, "snacks");
      setSnack({ ...snack, image: url });
    } catch (error: any) {
      console.error("Failed to upload snack image:", error);
      alert(error?.message || "Failed to upload snack image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!snack || !user?.uid) return;
    setSaving(true);

    try {
      const payload = { ...snack, ownerUID: user.uid };

      if (snackDocId) {
        await updateDoc(doc(db, "snacks", snackDocId), payload);
      } else {
        const createdDoc = await addDoc(collection(db, "snacks"), payload);
        setSnackDocId(createdDoc.id);
        onSnackChange?.(createdDoc.id);
      }

      if (persistedImage && persistedImage !== payload.image) {
        await deleteImageFileByUrl(persistedImage);
      }

      setPersistedImage(payload.image || "");
    } catch (err) {
      console.error("Error saving snack:", err);
      alert("Failed to save snack.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-slate-500">Loading snack details...</div>;
  }

  if (!snack) return null;

  return (
    <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
          Snack details
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
          {snackDocId ? "Update your restaurant profile" : "Create your restaurant profile"}
        </h2>
      </div>

      {!snackDocId && (
        <p className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Add your snack details. They will appear here once you save them.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Snack name</label>
              <input value={snack.name} onChange={(e) => setSnack({ ...snack, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input value={snack.phone} onChange={(e) => setSnack({ ...snack, phone: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
            <input value={snack.address} onChange={(e) => setSnack({ ...snack, address: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea value={snack.description} onChange={(e) => setSnack({ ...snack, description: e.target.value })} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Link2 className="h-4 w-4" />
              Image URL
            </label>
            <input value={snack.image} onChange={(e) => setSnack({ ...snack, image: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-5">
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[24px] border border-dashed border-orange-200 bg-orange-50/60 px-4 py-5 text-sm font-medium text-orange-700 hover:bg-orange-50">
            <UploadCloud className="h-5 w-5" />
            {uploadingImage ? "Uploading image..." : "Upload image from device"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50">
            {snack.image ? (
              <img src={snack.image} alt={snack.name || "Snack"} className="h-[360px] w-full object-cover" />
            ) : (
              <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-slate-400">
                <ImagePlus className="h-10 w-10" />
                <p className="text-sm">Your snack cover image will appear here</p>
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={saving || uploadingImage} className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50">
            {saving ? "Saving..." : snackDocId ? "Save changes" : "Create snack"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnackInfo;
