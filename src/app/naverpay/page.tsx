"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function NaverPayPage() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!;
  const chainId = process.env.NEXT_PUBLIC_NAVER_CHAIN_ID!;
  const merchantPayKey = process.env.NEXT_PUBLIC_NAVER_MERCHANT_PAY_KEY!;
  const returnUrl = process.env.NEXT_PUBLIC_NAVER_RETURN_URL!;

  useEffect(() => {
    if (!window.Naver?.Pay) return;

    const oPay = window.Naver.Pay.create({
      mode: "development",
      clientId,
      chainId,
    });

    const button = buttonRef.current;
    if (button) {
      const handleClick = () => {
        oPay.open({
          merchantPayKey,
          productName: "상품명",
          productCount: "1",
          totalPayAmount: "1000",
          taxScopeAmount: "1000",
          taxExScopeAmount: "0",
          returnUrl,
        });
      };
      button.addEventListener("click", handleClick);
      return () => {
        button.removeEventListener("click", handleClick);
      };
    }
  }, [clientId, chainId, merchantPayKey, returnUrl]);

  return (
    <>
      <Script src="https://nsp.pay.naver.com/sdk/js/naverpay.min.js" strategy="afterInteractive" />
      <div>
        <h1>네이버페이 테스트</h1>
        <button ref={buttonRef}>네이버페이 결제 버튼</button>
      </div>
    </>
  );
}
