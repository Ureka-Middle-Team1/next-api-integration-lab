import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: 사용자 메시지 기반 추천 제품 응답
 *     description: 사용자의 메시지를 기반으로 OpenAI API를 통해 제품을 추천합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "고급스럽고 편안한 소파 추천해줘"
 *     responses:
 *       200:
 *         description: 성공적으로 추천 응답을 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *       400:
 *         description: message 누락
 *       500:
 *         description: API 키 없음 또는 OpenAI 호출 실패
 */
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
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `넌 사용자에게 제품을 추천하는 AI야.
다음은 추천 가능한 제품 리스트야:

1. 모노톤 패브릭 소파 - 부드럽고 미니멀한 디자인
2. 클래식 가죽 소파 - 고급스러운 브라운톤
3. 스마트 리클라이너 - USB 충전 가능, 각도 조절

사용자의 키워드나 취향에 맞춰 가장 적합한 제품을 하나만 골라서 설명해줘.`,
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
