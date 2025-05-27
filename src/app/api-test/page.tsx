"use client";
import { useState } from "react";

export default function ApiTestPage() {
  const [message, setMessage] = useState("");
  const [getResponse, setGetResponse] = useState("");
  const [postResponse, setPostResponse] = useState("");

  const handleGet = async () => {
    try {
      const res = await fetch(
        `/api/echo?message=${encodeURIComponent(message)}`
      );
      const data = await res.json();
      setGetResponse(data.received);
    } catch (error) {
      setGetResponse("요청 실패");
      console.error(error);
    }
  };

  const handlePost = async () => {
    try {
      const res = await fetch("/api/echo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setPostResponse(data.received);
    } catch (error) {
      setPostResponse("요청 실패");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔧 Echo API 테스트</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />

      <button onClick={handleGet} style={{ marginRight: "0.5rem" }}>
        GET 요청
      </button>
      <button onClick={handlePost}>POST 요청</button>

      <div style={{ marginTop: "2rem" }}>
        <h2>응답 결과</h2>
        <p>
          <strong>GET:</strong> {getResponse}
        </p>
        <p>
          <strong>POST:</strong> {postResponse}
        </p>
      </div>
    </div>
  );
}
