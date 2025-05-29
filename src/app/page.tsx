"use client";

import { useState } from "react";
import { Button as TailwindButton } from "@/components/tailwind/Button";
import { Button as StyledButton } from "@/components/styled/Button";
import { Button as ShadcnButton } from "@/components/shadcnUi/button"; // shadcn 방식
import TossPayment from "./toss-test/page";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>OpenAI ChatBot</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="질문을 입력하세요"
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={sendMessage}>보내기</button>
      <div style={{ marginTop: 20 }}>
        <strong>GPT 응답:</strong>
        <p>{reply}</p>
      </div>

      {/* Tailwind를 활용한 테스트 */}
      <h1 className="text-xl font-bold my-8">Tailwind 테스트</h1>
      <div className="space-x-4">
        <TailwindButton variant="default">Tailwind 기본</TailwindButton>
        <TailwindButton variant="outline">Tailwind 테두리</TailwindButton>
      </div>

      {/* Styled-Components를 활용한 테스트 */}
      <h1 className="text-xl font-bold my-8">Styled Components 테스트</h1>
      <div className="space-x-4 mt-4">
        <StyledButton variant="default">Styled 기본</StyledButton>
        <StyledButton variant="outline">Styled 테두리</StyledButton>
      </div>

      {/* shadcn/ui를 활용한 테스트 */}
      <h1 className="text-xl font-bold my-8">shadcn/ui 테스트</h1>
      <div className="space-x-4 mt-4">
        <ShadcnButton>Shadcn 기본</ShadcnButton>
        <ShadcnButton variant="outline">Shadcn 테두리</ShadcnButton>
        <ShadcnButton variant="ghost" size="sm">
          Shadcn 고스트
        </ShadcnButton>
      </div>
      <hr style={{ margin: "40px 0" }} />
      <TossPayment />
    </main>
  );
}
