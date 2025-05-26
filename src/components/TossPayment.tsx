"use client";
import { useEffect } from "react";

export default function TossPayment() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const tossPayments = (window as any).TossPayments(process.env.NEXT_PUBLIC_CLIENT_KEY);

    tossPayments.requestPayment("카드", {
      amount: 5000,
      orderId: "order_" + new Date().getTime(),
      orderName: "토스 결제 테스트",
      customerName: "홍길동",
      successUrl: "http://localhost:3000/success",
      failUrl: "http://localhost:3000/fail",
    });
  };

  return (
    <div>
      <h2>토스 결제 테스트</h2>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
