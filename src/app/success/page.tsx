"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Success() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("결제 승인 중입니다...");

  useEffect(() => {
    async function confirmPayment() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/payments/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setMessage("결제가 성공적으로 완료되었습니다!");
        } else {
          setMessage("결제 승인에 실패했습니다: " + (data.error?.message || "알 수 없는 오류"));
        }
      } catch (error) {
        setMessage("서버와 통신 중 오류가 발생했습니다.");
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <div>
      <h1>결제 결과</h1>
      <p>{message}</p>
    </div>
  );
}
