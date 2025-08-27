import {
  collection,
  where,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from "../config/firebase";
import { useEffect, useState } from 'react';

export const OrderConfirmation = () => {

  const [orderNumber,setOrderNumber]=useState(null)
  const [content,setContent]=useState({
    title:'Order Creation !',
    message:'Please wait',
    loading:'⌛ In Progress...'
  })

  async function fetchOrder(){
    try{
      const ordersRef = collection(db, "orders");

      const q = query(ordersRef, where('userUID', '==', auth.currentUser?.uid), orderBy("number", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastOrder = querySnapshot.docs[0].data();
        setOrderNumber(lastOrder.number)
        setContent({
          title:`Your order number is ${lastOrder.number}`,
          message:'Thank you for your order',
          loading:'⌛ Your order will be prepared as soon as possible'
        })
      }
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  }

  useEffect(()=>{
    let interval:any
    if (!orderNumber) {
      interval = setInterval(()=>{
        fetchOrder()
      },1000)      
    }else{
      clearInterval(interval)
    }

  },[orderNumber])

  return (
    <div className="text-center bg-white/70 w-fit m-auto rounded-3xl px-10 py-5">
      <h2 className="text-2xl font-bold text-amber-600">{content?.title}</h2>
      <p className="mt-2 text-black">{content?.message}</p>
      <div className="mt-4 animate-pulse text-black">{content?.loading}</div>
    </div>
  );
};
