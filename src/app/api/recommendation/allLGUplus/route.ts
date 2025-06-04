import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import convert, { ElementCompact } from "xml-js";

const VOICES = [0, 100, 200];
const DATAS = [500, 1000, 3000, 5000];
const SMS = [0, 50, 100];
const AGES = [18, 20, 30, 65];
const TYPES = [2, 3, 6];
const DISCOUNTS = [0, 12, 24];

export async function GET(req: NextRequest) {
  const RECOMMENDATION_API_KEY = process.env.RECOMMENDATION_API_KEY;
  if (!RECOMMENDATION_API_KEY) {
    return NextResponse.json({ error: "API 키 없음" }, { status: 500 });
  }

  const allItems: any[] = [];
  const seen = new Set<string>();

  function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

  const urls: string[] = [];
  for (const voice of VOICES) {
    for (const data of DATAS) {
      for (const sms of SMS) {
        for (const age of AGES) {
          for (const type of TYPES) {
            for (const dis of DISCOUNTS) {
              const url = `https://www.smartchoice.or.kr/api/openAPI.xml?authkey=${RECOMMENDATION_API_KEY}&voice=${voice}&data=${data}&sms=${sms}&age=${age}&type=${type}&dis=${dis}`;
              urls.push(url);
            }
          }
        }
      }
    }
  }

  const batches = chunkArray(urls, 50);

for (const [batchIndex, batch] of batches.entries()) {
  const results = await Promise.allSettled(batch.map((url) => axios.get(url)));

  for (const [i, res] of results.entries()) {
    if (res.status === "fulfilled") {
      const xml = res.value.data;
      const jsonData = convert.xml2js(xml, {
        compact: true,
        ignoreDeclaration: true,
        ignoreInstruction: true,
      }) as ElementCompact;

      const items = jsonData?.root?.items?.item;
      const list = Array.isArray(items) ? items : items ? [items] : [];

      const lguPlusOnly = list.filter(
        (item) => item.v_tel?._text === "LGU+"
      );

      for (const item of lguPlusOnly) {
        const name = item.v_plan_name?._text;
        if (!seen.has(name)) {
          seen.add(name);
          allItems.push(item);
        }
      }
    } else {
      console.warn(`요청 실패 [배치 ${batchIndex}, 인덱스 ${i}]:`, res.reason);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
}


  return NextResponse.json({
    success: true,
    count: allItems.length,
    result: allItems,
  });
}
