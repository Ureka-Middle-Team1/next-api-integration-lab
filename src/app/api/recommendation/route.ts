import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import convert from 'xml-js';
import { ElementCompact } from 'xml-js';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voice, data, sms, age, type, dis } = body;

    const RECOMMENDATION_API_KEY = process.env.RECOMMENDATION_API_KEY;
     if (!RECOMMENDATION_API_KEY) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }
    const url = `https://www.smartchoice.or.kr/api/openAPI.xml?authkey=${RECOMMENDATION_API_KEY}&voice=${voice}&data=${data}&sms=${sms}&age=${age}&type=${type}&dis=${dis}`;

    const response = await axios.get(url);
    const xmlData = response.data;
    /**
     * 요금제 추천 API 요청
     *
     * @param voice - 월 평균 통화량 (입력단위:분)
     * @param data - 월 평균 데이터 사용량 (입력단위:MB)
     * @param sms - 월 평균 문자 발송량 (입력단위:건)
     * @param age - 연령(성인:20, 청소년:18, 실버:65) => 실제 입력에서는 99살까지는 결과가 출력됩니다.
     * @param type - 서비스 타입(3G:2, LTE:3, 5G:6)
     * @param dis - 약정기간 (무약정:0, 12개월:12, 24개월:24)
     */


    const jsonData = convert.xml2js(xmlData, {
  compact: true,
  ignoreDeclaration: true,
  ignoreInstruction: true,
}) as ElementCompact;


    const items = jsonData?.root?.items?.item;

    if (!items) {
      return NextResponse.json({
        success: true,
        result: [],
        count: 0,
      });
    }

    const filteredItems = Array.isArray(items)
  ? items.filter((item) => item.v_tel?._text === "LGU+")
  : (items.v_tel?._text === "LGU+" ? [items] : []);

return NextResponse.json({
  success: true,
  result: filteredItems,
  count: filteredItems.length,
});

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("요금제 추천 API 오류:", error.message);
      return NextResponse.json(
        { success: false, error: '요금제 추천 실패: ' + error.message },
        { status: 500 }
      );
    } else {
      console.error("요금제 추천 API 알 수 없는 오류:", error);
      return NextResponse.json(
        { success: false, error: '요금제 추천 실패: 알 수 없는 오류' },
        { status: 500 }
      );
    }
  }
}