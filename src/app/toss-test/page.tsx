"use client";
import Script from "next/script";

// TossPayments 타입 정의(존재 알리기)
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (
        method: string,
        options: {
          amount: number;
          orderId: string;
          orderName: string;
          customerName: string;
          successUrl: string;
          failUrl: string;
        }
      ) => void;
    };
  }
}

export default function TossPayment() {
  const handlePayment = () => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      alert("클라이언트 키를 설정해주세요.");
      return;
    }

    const tossPayments = window.TossPayments(clientKey);

    tossPayments.requestPayment("카드", {
      amount: 5000,
      orderId: "order_" + new Date().getTime(),
      orderName: "토스 결제 테스트",
      customerName: "홍길동",
      successUrl: "http://localhost:3000/toss-test/success",
      failUrl: "http://localhost:3000/toss-test/fail",
    });
  };

  return (
    <div>
      <h2>토스 결제 테스트</h2>
      <Script
        src="https://js.tosspayments.com/v1"
        strategy="afterInteractive" // 페이지가 인터랙티브 된 후 로드
        onError={() => {
          console.error("TossPayments 스크립트 로드 실패");
          alert("결제 모듈을 불러오는데 실패했습니다.");
        }}
      />
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
