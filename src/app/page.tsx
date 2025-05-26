"use client";
import { useState } from "react";
import TossPayment from "../components/TossPayment";

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

      <hr style={{ margin: "40px 0" }} />

      <TossPayment />
    </main>
  );
}
