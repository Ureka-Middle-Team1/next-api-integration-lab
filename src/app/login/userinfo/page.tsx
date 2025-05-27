"use client";

import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>로딩 중...</p>;
  }

  if (!session) {
    return <p>로그인되지 않았습니다.</p>;
  }

  return (
    <div className="p-6">
      <h1>로그인 성공 🎉</h1>
      <p>이름: {session.user?.name}</p>
      <p>이메일: {session.user?.email}</p>
      <img
        src={session.user?.image ?? ""}
        alt="프로필 이미지"
        className="w-20 h-20 rounded-full"
      />
    </div>
  );
}
