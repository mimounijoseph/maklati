"use client";

import React, { FC, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { ImagePlus, Link2, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/router";
import Sidebar from "../../sidebar";
import { auth, db } from "@/config/firebase";
import { Plat } from "@/interfaces/product";
import PexelsSearchModal from "@/components/pexelsSearch";
import Spinner from "@/components/spinner";
import ProtectedLayout from "@/guard/adminProtectedPage";
import { deleteImageFileByUrl, uploadImageFile } from "@/utils/uploadImage";

type Category = {
  id: string;
  name: string;
};

const EditPlat: FC = () => {
  const router = useRouter();
  const { docId } = router.query;

  const [formData, setFormData] = useState<Omit<Plat, "snackId" | "createdAt">>({
    id: 0,
    name: "",
    description: "",
    status: true,
    category: "",
    cost: [{ size: "", price: 0, quantity: 0 }],
    urlPhoto: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [persistedImageUrl, setPersistedImageUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    const resolvedDocId = Array.isArray(docId) ? docId[0] : docId;
    if (!resolvedDocId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [categoriesSnapshot, platSnapshot] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDoc(doc(db, "plat", resolvedDocId)),
        ]);

        const cats: Category[] = categoriesSnapshot.docs.map((categoryDoc) => ({
          id: categoryDoc.id,
          ...categoryDoc.data(),
        })) as Category[];
        setCategories(cats);

        if (!platSnapshot.exists()) return;

        const data = platSnapshot.data() as Plat;
        if (data.snackId !== auth.currentUser?.uid) return;

        setFormData({
          id: data.id || 0,
          name: data.name || "",
          description: data.description || "",
          status: data.status ?? true,
          category: data.category || "",
          cost: data.cost?.length ? data.cost : [{ size: "", price: 0, quantity: 0 }],
          urlPhoto: data.urlPhoto || "",
        });
        setPersistedImageUrl(data.urlPhoto || "");
      } catch (error) {
        console.error("Error fetching plat:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [docId, router.isReady]);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadImageFile(file, "plats");
      setFormData((prev) => ({ ...prev, urlPhoto: url }));
    } catch (error: any) {
      console.error("Image upload failed:", error);
      alert(error?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedDocId = Array.isArray(docId) ? docId[0] : docId;
    if (!resolvedDocId) return;

    try {
      setSaving(true);
      const existingSnapshot = await getDoc(doc(db, "plat", resolvedDocId));
      if (!existingSnapshot.exists()) return;
      const existingData = existingSnapshot.data() as Plat;
      if (existingData.snackId !== auth.currentUser?.uid) return;

      await updateDoc(doc(db, "plat", resolvedDocId), {
        ...formData,
        cost: formData.cost.filter((item) => item.size && item.price > 0),
        updatedAt: new Date(),
      });

      if (persistedImageUrl && persistedImageUrl !== formData.urlPhoto) {
        await deleteImageFileByUrl(persistedImageUrl);
      }

      setPersistedImageUrl(formData.urlPhoto || "");

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error updating plat: ", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="admin min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_32%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_32%,#ffffff_100%)]">
          <Sidebar />
          <div className="p-5 sm:ml-64 sm:p-8">
            <div className="mt-14 flex justify-center py-16">
              <Spinner />
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="admin min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_32%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_32%,#ffffff_100%)]">
        <Sidebar />
        <div className="p-5 sm:ml-64 sm:p-8">
          <div className="mt-14">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-950">Edit Plat</h1>
              <p className="mt-2 text-sm text-slate-500">Update the details of this plat.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-6xl rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6"
            >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <div className="min-w-0 space-y-6">
                  <section className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-950">Basic details</h2>
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" required />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" required>
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" required />
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">Sizes and prices</h2>
                        <p className="mt-1 text-sm text-slate-500">Update the pricing variants for this plat.</p>
                      </div>
                      <button type="button" onClick={addCostRow} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-orange-200 hover:text-orange-600">
                        Add size
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {formData.cost.map((c, index) => (
                        <div key={index} className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                          <input type="text" placeholder="Size" value={c.size} onChange={(e) => handleCostChange(index, "size", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
                          <input type="number" placeholder="Price" value={c.price} onChange={(e) => handleCostChange(index, "price", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
                          <input type="number" placeholder="Default quantity" value={c.quantity} onChange={(e) => handleCostChange(index, "quantity", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
                          <button type="button" onClick={() => removeCostRow(index)} className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 sm:col-span-2 xl:w-12">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="min-w-0 space-y-6">
                  <section className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-950">Product image</h2>
                    <p className="mt-1 text-sm text-slate-500">Upload from your device, paste a link, or choose from Pexels.</p>

                    <div className="mt-5 space-y-4">
                      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[24px] border border-dashed border-orange-200 bg-orange-50/60 px-4 py-5 text-sm font-medium text-orange-700 hover:bg-orange-50">
                        <UploadCloud className="h-5 w-5" />
                        {uploadingImage ? "Uploading image..." : "Upload from device"}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>

                      <div className="rounded-[24px] border border-slate-200 p-3">
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Link2 className="h-4 w-4" />
                          Image URL
                        </label>
                        <input type="text" name="urlPhoto" value={formData.urlPhoto} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" placeholder="https://..." />
                      </div>

                      <div className="rounded-[24px] border border-slate-200 p-3">
                        <PexelsSearchModal onSelect={(url) => setFormData({ ...formData, urlPhoto: url })} />
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                      {formData.urlPhoto ? (
                        <img src={formData.urlPhoto} alt="Selected" className="h-56 w-full object-cover sm:h-72" />
                      ) : (
                        <div className="flex h-56 flex-col items-center justify-center gap-3 text-slate-400 sm:h-72">
                          <ImagePlus className="h-10 w-10" />
                          <p className="text-sm">Your plat preview will appear here</p>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">Save update</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Keep the image URL in Firestore while the actual file is stored in Supabase.
                    </p>
                    <button type="submit" disabled={saving || uploadingImage} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50">
                      {saving && <Spinner />}
                      Update plat
                    </button>
                  </section>
                </div>
              </div>

              {showPopup && (
                <div className="fixed bottom-6 right-6 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
                  Plat updated successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default EditPlat;
