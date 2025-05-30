// 사용자 입력 프롬프트가 관련 내용인지 아닌지 Classification 하는 classifyPrompt api
// /app/api/classifyPrompt/route.ts
import { NextResponse } from "next/server";

// normalizeBooleanReply 함수는 아래 또는 별도 utils로 분리 가능 (추후 설계 시 고려사항)
function normalizeBooleanReply(text: unknown): boolean | null {
  if (typeof text !== "string") return null;

  const normalized = text.trim().toLowerCase();

  const yesPatterns = [
    "yes",
    "yeah",
    "yep",
    "sure",
    "맞아요",
    "네",
    "응",
    "ㅇㅇ",
    "그렇습니다",
    "물론이죠",
  ];
  const noPatterns = ["no", "nope", "nah", "아니요", "아니", "ㄴㄴ", "아닙니다", "전혀요"];

  if (yesPatterns.includes(normalized)) return true;
  if (noPatterns.includes(normalized)) return false;

  for (const yes of yesPatterns) {
    if (normalized.startsWith(yes)) return true;
  }

  for (const no of noPatterns) {
    if (normalized.startsWith(no)) return false;
  }

  return null;
}

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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `당신은 분류 AI입니다. 사용자의 메시지가 "요금제" 또는 "구독 서비스" 추천과 관련된지 판단하십시오.

                      아래의 예시는 참조용입니다:

                      - "무제한 요금제 추천해줘" → yes  
                      - "넷플릭스 어떤 구독이 좋을까?" → yes  
                      - "요즘 인기 있는 스트리밍 서비스 뭐야?" → yes  
                      - "오늘 날씨 어때?" → no  
                      - "강아지 키우는 팁 알려줘" → no

                      분류 기준: 추천/비교/선택 유도와 관련된 요금제·구독 요청인지 여부를 판단.

                      사용자 메시지:
                      {{message}}

                      응답은 반드시 "yes" 또는 "no"만 출력하세요. 설명은 절대 하지 마세요.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    const isValid = normalizeBooleanReply(reply) === true; // normalizeBooleanReply()를 이용해서 답변 정규화를 철저히 진행

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("❌ classifyPrompt 호출 실패:", error);
    return NextResponse.json({ error: "Failed to call OpenAI API" }, { status: 500 });
  }
}
