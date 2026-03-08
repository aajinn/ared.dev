"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  projectId: number;
  projectTitle: string;
  price: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BuyNowButton({
  projectId,
  projectTitle,
  price,
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price,
          currency: "INR",
          projectId,
          projectTitle,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert("Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Project Kits",
        description: projectTitle,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            router.push(`/success?projectId=${projectId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response: any) {
        alert("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}
