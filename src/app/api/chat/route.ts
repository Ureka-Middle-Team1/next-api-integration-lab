import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "message 누락" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ 환경변수 OPENAI_API_KEY 가 설정되지 않았습니다.");
    return NextResponse.json({ error: "API 키 없음" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: `넌 라이프스타일에 맞는 가구를 추천해주는 스마트 인테리어 AI야.

                      다음은 추천 가능한 소파 제품 리스트야:

                      1. 모노톤 패브릭 소파 - 부드럽고 미니멀한 디자인
                      2. 클래식 가죽 소파 - 고급스러운 브라운톤
                      3. 스마트 리클라이너 - USB 충전 가능, 각도 조절

                      사용자에 대한 설명이 들어오면, 아래 순서로 응답해줘:

                      1. 사용자의 취향/환경 분석 요약 (1~2문장)
                      2. 세 제품 중 가장 적합한 제품을 하나만 선택
                      3. 선택 이유를 실용성, 디자인, 상황 적합성 관점에서 설명
                      4. 마지막엔 한 문장으로 사용자의 선택에 확신을 주는 마무리 멘트를 해줘

                      추가 조건:
                      - 추천 제품은 오직 하나만 고를 것
                      - 분석이 부족하더라도 너만의 추론을 활용해 논리적으로 유도할 것
                      - 감정이입은 하지 말고, 분석 중심으로 응답할 것`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await res.json();
    console.log("🔍 OpenAI 응답:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content ?? "응답 없음";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("❌ OpenAI API 호출 실패:", error);
    return NextResponse.json({ error: "Failed to call OpenAI API" }, { status: 500 });
  }
}
