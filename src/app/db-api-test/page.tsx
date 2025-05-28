"use client";

import { useState } from "react";
import type { EchoMessage } from "@prisma/client";

export default function DbApiTestPage() {
  const [message, setMessage] = useState("");
  const [messagePostResponse, setMessagePostResponse] = useState("");
  const [messageList, setMessageList] = useState<EchoMessage[]>([]);

  const handleMessagePost = async () => {
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data: EchoMessage = await res.json();
      setMessagePostResponse(`ID: ${data.id}, 메시지: ${data.message}`);
    } catch (error) {
      setMessagePostResponse("메시지 POST 실패");
      console.error(error);
    }
  };

  const handleMessageGet = async () => {
    try {
      const res = await fetch("/api/message");
      const data: { messages: EchoMessage[] } = await res.json();
      setMessageList(data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📦 DB API 테스트 (Prisma)</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleMessagePost} style={{ marginRight: "0.5rem" }}>
          Message POST
        </button>
        <button onClick={handleMessageGet}>Message GET</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>POST 응답</h2>
        <p>{messagePostResponse}</p>

        <h2>저장된 메시지 목록</h2>
        <ul>
          {messageList.map((msg) => (
            <li key={msg.id}>
              #{msg.id}: {msg.message} (
              {new Date(msg.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
