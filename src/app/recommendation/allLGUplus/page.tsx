"use client";

import { useEffect, useState } from "react";

type ApiItem = {
  v_tel: { _text: string };
  v_plan_price: { _text: string };
  v_dis_price: { _text: string };
  v_plan_name: { _text: string };
  v_plan_display_voice: { _text: string };
  v_plan_display_data: { _text: string };
  v_plan_display_sms: { _text: string };
  rn: { _text: string };
};

export default function AllLGUplusPage() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/recommendation/allLGUplus")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.result ?? []);
        setCount(data.count ?? 0);
      })
      .catch((err) => console.error("요금제 불러오기 실패", err));
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">LG U+ 전체 요금제 목록</h1>
      <p className="text-white">총 {count}개 요금제 발견됨</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 border rounded bg-white text-black shadow space-y-1"
          >
            <h2 className="text-lg font-bold">{item.v_plan_name._text}</h2>
            <p>📞 통신사: {item.v_tel._text}</p>
            <p>💰 가격: {item.v_plan_price._text}원</p>
            <p>💬 할인가: {item.v_dis_price._text}원</p>
            <p>🗣 음성: {item.v_plan_display_voice._text}</p>
            <p>📶 데이터: {item.v_plan_display_data._text}</p>
            <p>✉ 문자: {item.v_plan_display_sms._text}</p>
            <p>🏅 순위: {item.rn._text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
