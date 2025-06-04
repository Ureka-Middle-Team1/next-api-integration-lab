'use client';

import { useState } from 'react';
import { useMemo } from "react";
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

type PlanForm = {
  voice: string;
  data: string;
  sms: string;
  age: string;
  type: string;
  dis: string;
};

function extractJsonFromReply(reply: string): PlanForm {
  const defaultForm: PlanForm = {
    voice: "200",
    data: "1000",
    sms: "50",
    age: "30",
    type: "5G",
    dis: "0",
  };

   try {
    const start = reply.indexOf("{");
    const end = reply.lastIndexOf("}") + 1;
    const jsonText = reply.slice(start, end);
    const parsed = JSON.parse(jsonText);
    return { ...defaultForm, ...parsed };
  } catch (e) {
    console.error("❌ JSON 파싱 실패:", e);
    return defaultForm;
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function PlanRecommendationPage() {
  const [form, setForm] = useState({
    voice: '',
    data: '',
    sms: '',
    age: '',
    type: '',
    dis: '',
  });
  

  type ResultItem = {
  telecom: string;
  price: string;
  discountPrice: string;
  planName: string;
  voice: string;
  data: string;
  sms: string;
  rank: string;
};

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

  const [result, setResult] = useState<ResultItem[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const [gptReply, setGptReply] = useState("");
const [isValid, setIsValid] = useState<boolean | null>(null);



const [minData, setMinData] = useState<number>(0);

const filtered = useMemo(() => {
  return result.filter((item) => {
    const dataNum = parseFloat(item.data.replace(/[^\d.]/g, ""));
    return isNaN(dataNum) || dataNum >= minData;
  });
}, [result, minData]);

const getPrices = (key: "price" | "discountPrice") =>
  filtered.map((item) => Number(item[key]) || 0);

const chartOptions = { maintainAspectRatio: false };

const barChart = {
  labels: filtered.map((item) => item.planName),
  datasets: [
    {
      label: "원가",
      data: getPrices("price"),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

const lineChart = {
  labels: filtered.map((item) => item.planName),
  datasets: [
    {
      label: "원가",
      data: getPrices("price"),
      borderColor: "blue",
      backgroundColor: "blue",
    },
    {
      label: "할인가",
      data: getPrices("discountPrice"),
      borderColor: "green",
      backgroundColor: "green",
    },
  ],
};

const pieChart = useMemo(() => {
  const byTel: { [key: string]: number } = {};
  filtered.forEach((item) => {
    const price = Number(item.price) || 0;
    byTel[item.telecom] = (byTel[item.telecom] || 0) + price;
  });

  return {
    labels: Object.keys(byTel),
    datasets: [
      {
        data: Object.values(byTel),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };
}, [filtered]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const classifyUserPrompt = async (message: string): Promise<boolean | null> => {
  try {
    const res = await fetch("/api/classifyPrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.isValid === true;
  } catch (err) {
    console.error("분류 실패:", err);
    return null;
  }
};

const sendMessageToGpt = async (message: string): Promise<string> => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
};

const handleMessageSend = async () => {
  setGptReply("");
  const valid = await classifyUserPrompt(message);
  setIsValid(valid);

  if (valid === false) {
    setGptReply("❌ 이 메시지는 요금제 추천과 관련이 없습니다.");
    return;
  }

  if (valid === null) {
    setGptReply("⚠️ 메시지를 분석할 수 없습니다. 다시 입력해 주세요.");
    return;
  }

  const reply = await sendMessageToGpt(message);
  setGptReply(reply);

  const extracted = extractJsonFromReply(reply);
if (!extracted) {
  setError("❌ GPT 응답에서 JSON을 추출할 수 없습니다.");
  return;
}
setForm(extracted);
await handleSubmit(extracted);

};

  const handleSubmit = async (formInput = form) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/recommendation', formInput);
      const parsed = response.data;
const items: ApiItem[] = parsed.result ?? [];

if (items.length > 0) {
  const mapped = items.map((item: ApiItem) => ({
    telecom: item.v_tel._text,
    price: item.v_plan_price._text,
    discountPrice: item.v_dis_price._text,
    planName: item.v_plan_name._text,
    voice: item.v_plan_display_voice._text,
    data: item.v_plan_display_data._text,
    sms: item.v_plan_display_sms._text,
    rank: item.rn._text,
  }));
  setResult(mapped);
} else {
  setError('❌ 요금제 결과가 없습니다.');
  setResult([]);
}

    } catch (err) {
  setError(
    "오류 발생: " + (err instanceof Error ? err.message : "알 수 없음")
  );
}
 finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <section className="space-y-2">
  <h2 className="text-xl font-semibold">GPT 메시지 테스트</h2>
  <input
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="요금제 관련 질문을 입력해보세요"
    className="border px-2 py-1 rounded w-full"
  />
  <button
    onClick={handleMessageSend}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    GPT 응답받고 요금제 추천
  </button>
  {gptReply && (
    <div className="p-4 bg-gray-100 rounded border text-black">
      <strong>GPT 응답:</strong>
      <p>{gptReply}</p>
    </div>
  )}
  {Object.values(form).some((v) => v !== "") && (
  <div className="p-4 bg-white rounded border shadow space-y-1">
    <h3 className="text-lg font-semibold text-black">📋 추출된 조건</h3>
    <p className="text-black">🗣 음성: {form.voice}분</p>
    <p className="text-black">📶 데이터: {form.data}MB</p>
    <p className="text-black">✉ 문자: {form.sms}건</p>
    <p className="text-black">👤 나이: {form.age}세</p>
    <p className="text-black">📱 통신타입: {form.type}</p>
    <p className="text-black">🎁 약정기간: {form.dis}</p>
  </div>
)}
</section>

      {/* <h1 className="text-2xl font-bold">📡 통신요금 추천 API 테스트</h1>

      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <label className="w-20 font-medium capitalize">{key}:</label>
            <input
              className="flex-1 border px-2 py-1 rounded"
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key}
            />
          </div>
        ))}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => handleSubmit()}
        disabled={loading}
      >
        {loading ? '불러오는 중...' : '요금제 추천받기'}
      </button> */}

      {error && <p className="text-red-500">{error}</p>}

      {result.length > 0 && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded shadow bg-white space-y-1"
            >
              <h2 className="text-lg font-semibold text-black">{item.planName}</h2>
              <p className="text-black">📞 통신사: {item.telecom}</p>
              <p className="text-black">💸 가격: {item.price}원</p>
              <p className="text-black">🗣 음성: {item.voice}</p>
              <p className="text-black">📶 데이터: {item.data}</p>
              <p className="text-black">✉ 문자: {item.sms}</p>
              <p className="text-black">🏅 순위: {item.rank}</p>
            </div>
          ))}
        </div>

        <section className="flex flex-wrap gap-6 pt-6">
      <ChartCard title="요금제 바 차트">
        <Bar data={barChart} options={chartOptions} />
      </ChartCard>
      <ChartCard title="원가 vs 할인가">
        <Line data={lineChart} options={chartOptions} />
      </ChartCard>
      <ChartCard title="통신사별 요금 비율">
        <Pie data={pieChart} options={chartOptions} />
      </ChartCard>
    </section>
  </>
      )}
    </main>
  );
}
const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="w-[calc(50%-0.75rem)] h-64 bg-white p-4 rounded shadow flex flex-col">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);