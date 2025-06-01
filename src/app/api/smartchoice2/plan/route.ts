import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import convert from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voice, data, sms, age, type, dis } = body;

    const API_KEY = process.env.SMARTCHOICE_API_KEY;
    const url = `https://www.smartchoice.or.kr/api/openAPI.xml?authkey=${API_KEY}&voice=${voice}&data=${data}&sms=${sms}&age=${age}&type=${type}&dis=${dis}`;

    const response = await axios.get(url);
    const xmlData = response.data;

    const jsonData = convert.xml2js(xmlData, {
      compact: true,
      ignoreDeclaration: true,
      ignoreInstruction: true,
      spaces: 2,
    } as any);

    return NextResponse.json(jsonData);
  } catch (error: any) {
    console.error("요금제 추천 API 오류:", error.message);
    return NextResponse.json({ error: "요금제 추천 실패" }, { status: 500 });
  }
}
