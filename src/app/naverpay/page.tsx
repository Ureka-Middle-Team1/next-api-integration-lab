"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function NaverPayPage() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const chainId = process.env.NEXT_PUBLIC_NAVER_CHAIN_ID;
  const merchantPayKey = process.env.NEXT_PUBLIC_NAVER_MERCHANT_PAY_KEY;
  const returnUrl = process.env.NEXT_PUBLIC_NAVER_RETURN_URL;

  useEffect(() => {
    if (!clientId || !chainId || !merchantPayKey || !returnUrl) {
      console.warn("⚠️ 환경변수가 누락되어 네이버페이 초기화에 실패했습니다.");
      console.table({ clientId, chainId, merchantPayKey, returnUrl });
      return;
    }

    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (window.Naver?.Pay) {
        clearInterval(interval);
        const oPay = window.Naver.Pay.create({
          mode: "development",
          clientId,
          chainId,
        });

        if (buttonRef.current) {
          buttonRef.current.addEventListener("click", () => {
            oPay.open({
              merchantPayKey,
              productName: "상품명",
              productCount: "1",
              totalPayAmount: "1000",
              taxScopeAmount: "1000",
              taxExScopeAmount: "0",
              returnUrl,
            });
          });
        }

        setIsReady(true);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [clientId, chainId, merchantPayKey, returnUrl]);

  return (
    <>
      <Script src="https://nsp.pay.naver.com/sdk/js/naverpay.min.js" strategy="afterInteractive" />
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md text-center space-y-4">
        <h1 className="text-2xl font-bold">🟢 네이버페이 결제 테스트</h1>
        {!isReady && <p className="text-red-500 font-medium">환경변수 오류 또는 SDK 로딩 실패</p>}
        <button
          ref={buttonRef}
          disabled={!isReady}
          className={`px-4 py-2 text-white rounded-xl font-semibold transition ${
            isReady ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isReady ? "🛒 결제하기" : "로딩 중..."}
        </button>
      </div>
    </>
  );
}
