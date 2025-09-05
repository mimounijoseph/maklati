import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId, order } = req.body;

    if (!orderId || !order) {
      return res.status(400).json({ error: "Missing order data" });
    }

    // ✅ replicate Firebase Function logic
    await db.collection("notifications").add({
      orderId,
      restaurantId: order.snackId,
      title: `New Order #${order.number}`,
      message: `${order.name} ordered, total: ${order.total}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: "order",
    });

    return res.status(200).json({ success: true, message: "Notification created" });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
