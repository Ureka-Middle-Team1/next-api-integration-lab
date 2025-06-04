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
            content: `넌 사용자의 자연어 입력을 바탕으로 통신 요금제를 추천하는 분석형 AI야.

🧠 너의 목적은 두 가지야:
1. 사용자의 라이프스타일과 입력을 바탕으로 가장 적합한 요금제를 **텍스트로 설명**
2. 통신요금 추천 OpenAPI에 전달할 **6가지 항목을 반드시 추출**  
   👉 사용자가 명확히 말하지 않아도 **추정 또는 예측**해서 채워야 해.

🎯 반드시 추출해야 하는 항목 (모두 문자열로):
- voice: 월 평균 통화량 (단위: 분)
- data: 월 평균 데이터 사용량 (단위: MB)
- sms: 월 평균 문자 건수 (단위: 건)
- age: 나이 (숫자, 예: 20, 18, 65)
- type: 네트워크 종류 (2=3G, 3=LTE, 6=5G)
- dis: 약정 기간 (0=무약정, 12=12개월, 24=24개월)

📋 출력 형식 예시:
1. 먼저 사용자에게 요금제를 추천하는 **텍스트 설명**을 2~3문장 출력  
2. 마지막에 아래 JSON만 **단독으로** 출력
                      `,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await res.json();
    console.log("🔍 OpenAI 응답:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content ?? "응답 없음";
    return NextResponse.json({ 
  reply,
  raw: data
});

  } catch (error) {
    console.error("❌ OpenAI API 호출 실패:", error);
    return NextResponse.json({ error: "Failed to call OpenAI API" }, { status: 500 });
  }
}
