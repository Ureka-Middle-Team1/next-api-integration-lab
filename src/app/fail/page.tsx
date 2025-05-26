"use client";

import { useSearchParams } from "next/navigation";

export default function Fail() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "결제 실패";

  return (
    <div>
      <h1>결제 실패</h1>
      <p>{message}</p>
    </div>
  );
}
