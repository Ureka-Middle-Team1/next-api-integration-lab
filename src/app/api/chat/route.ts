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
            content: `넌 사용자에게 가장 적절한 **통신 요금제** 또는 **구독 서비스**를 추천해주는 AI야.

                      아래 조건을 참고해, 사용자 메시지를 분석한 후 반드시 다음 순서대로 응답해:

                      1. 사용자의 생활 스타일, 소비 습관, 사용 목적을 간단히 요약 (1~2문장)
                      2. 추천할 수 있는 요금제 또는 구독 서비스 중 **단 하나**를 선정
                      3. 선정 이유를 아래 3가지 관점에서 설명:
                        - 실용성 (데이터량/사용 편의성/혜택 등)
                        - 가격 효율성
                        - 사용자의 상황에 얼마나 잘 맞는지
                      4. 마지막에 확신을 주는 마무리 문장으로 정리 (1문장)

                      제약 조건:
                      - 무조건 하나의 요금제/서비스만 추천할 것
                      - 추론에 근거한 판단도 허용 (명확한 정보가 부족해도 추정 기반 추천 가능)
                      - 감정적인 표현은 배제하고, 분석적이고 객관적인 어조를 유지할 것

                      예상 가능한 추천 항목 예시 (단, 여기에 한정되지 않음):
                      - KT Y틴 요금제
                      - SKT 안심 5G 요금제
                      - LG U+ 구독 플랫폼 패스
                      - 넷플릭스 베이식 요금제
                      - 쿠팡 와우 멤버십
                      - 유튜브 프리미엄
                      - Apple One 번들
                      - 통신사 제휴 혜택 포함 구독 묶음 등
                      `,
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
