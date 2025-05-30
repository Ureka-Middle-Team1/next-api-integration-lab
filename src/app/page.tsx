"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  // 사용자 입력 프롬프트가 관련 내용인지부터 확인한다 (classifyPrompt api 호출)
  const classifyUserPrompt = async (message: string): Promise<boolean | null> => {
    try {
      const res = await fetch("/api/classifyPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      // res가 정상적으로 응답하지 않은 경우
      if (!res.ok) {
        console.error("❌ classifyPrompt API 오류", res.status);
        return null;
      }

      const data = await res.json();

      // 여기서 isValid 추출
      return data.isValid === true;
    } catch (err) {
      console.error("❌ Classifier 호출 오류", err);
      return null;
    }
  };

  // classifyUserPrompt 요청값(boolean)을 기준으로 로직 분기를 추가한 sendMessage
  const sendMessage = async () => {
    // 1단계: 먼저 분류 요청
    const isValid = await classifyUserPrompt(message);

    // isValid 값이 false인 경우
    if (isValid === false) {
      setReply("관련 내용으로 다시 입력해주세요.");
      return;
    }

    // isValid 값이 null인 경우 (모호한 답변일 경우)
    if (isValid === null) {
      setReply("죄송합니다. 질문을 이해하지 못했어요. 다시 한 번 입력해 주세요.");
      return;
    }

    // 2단계: 사용자 입력 프롬프트가 관련 내용일 경우에만 api/chat api를 호출해서 수행한다
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
      <h1>요금제를 추천해 드려요!</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="질문을 입력해 주세요"
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={sendMessage}>보내기</button>
      <div style={{ marginTop: 20 }}>
        <strong>GPT 응답:</strong>
        <p>{reply}</p>
      </div>
    </main>
  );
}
