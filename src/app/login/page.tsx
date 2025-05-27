"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={() => signIn("kakao", { callbackUrl: "/login/userinfo" })}
        className="bg-yellow-400 text-black px-4 py-2 rounded"
      >
        카카오로 로그인
      </button>
    </div>
  );
}
