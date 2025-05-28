"use client";

import { useEffect, useRef } from "react";

export default function NaverPayPage() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!;
  const chainId = process.env.NEXT_PUBLIC_NAVER_CHAIN_ID!;
  const merchantPayKey = process.env.NEXT_PUBLIC_NAVER_MERCHANT_PAY_KEY!;
  const returnUrl = process.env.NEXT_PUBLIC_NAVER_RETURN_URL!;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://nsp.pay.naver.com/sdk/js/naverpay.min.js";
    script.async = true;
    script.onload = () => {
      if (!window.Naver?.Pay) return;

      const oPay = window.Naver.Pay.create({
        mode: "development",
        clientId,
        chainId,
      });

      buttonRef.current?.addEventListener("click", () => {
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
    };
    document.body.appendChild(script);
  }, [clientId, chainId, merchantPayKey, returnUrl]);

  return (
    <div>
      <h1>네이버페이 테스트</h1>
      <button ref={buttonRef}>네이버페이 결제 버튼</button>
    </div>
  );
}
