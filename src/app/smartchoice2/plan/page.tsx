"use client";

import { useState, useMemo } from "react";
import axios from "axios";
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

// 타입 정의
type FormState = {
  voice: string;
  data: string;
  sms: string;
  age: string;
  type: string;
  dis: string;
};

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

// 유틸 컴포넌트
const FormInput = ({ name, value, onChange }: any) => (
  <div>
    <label className="font-medium capitalize">{name}:</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-2 py-1 rounded"
      placeholder={name}
    />
  </div>
);

const FormSelect = ({ name, value, onChange, options }: any) => (
  <div>
    <label className="font-medium capitalize">{name}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-2 py-1 rounded"
    >
      <option value="">선택</option>
      {options.map(([val, label]: [string, string]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default function PlanRecommendationPage() {
  const [form, setForm] = useState<FormState>({
    voice: "",
    data: "",
    sms: "",
    age: "",
    type: "",
    dis: "",
  });

  const [result, setResult] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [minData, setMinData] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/smartchoice2/plan", form);
      const items: ApiItem[] = response.data?.root?.items?.item ?? [];

      const mapped = items.map((item) => ({
        telecom: item.v_tel._text,
        price: item.v_plan_price._text,
        discountPrice: item.v_dis_price._text,
        planName: item.v_plan_name._text,
        voice: item.v_plan_display_voice._text,
        data: item.v_plan_display_data._text,
        sms: item.v_plan_display_sms._text,
        rank: item.rn._text,
      }));

      setResult(mapped.sort((a, b) => parseInt(a.rank) - parseInt(b.rank)));
    } catch (err) {
      setError(
        "오류 발생: " + (err instanceof Error ? err.message : "알 수 없음")
      );
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

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

  const avgByTel = useMemo(() => {
    const group: { [key: string]: number[] } = {};
    filtered.forEach((item) => {
      const price = Number(item.price) || 0;
      if (!group[item.telecom]) group[item.telecom] = [];
      group[item.telecom].push(price);
    });

    return Object.entries(group).map(([tel, prices]) => ({
      tel,
      avg: prices.length
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0,
    }));
  }, [filtered]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📡 통신요금 추천 API 테스트</h1>

      <section className="grid grid-cols-2 gap-4 max-w-xl">
        {(["voice", "data", "sms"] as (keyof FormState)[]).map((key) => (
          <FormInput
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <FormSelect
          name="age"
          value={form.age}
          onChange={handleChange}
          options={[
            ["18", "청소년"],
            ["20", "성인"],
            ["65", "실버"],
          ]}
        />
        <FormSelect
          name="type"
          value={form.type}
          onChange={handleChange}
          options={[
            ["2", "3G"],
            ["3", "LTE"],
            ["6", "5G"],
          ]}
        />
        <FormSelect
          name="dis"
          value={form.dis}
          onChange={handleChange}
          options={[
            ["0", "무약정"],
            ["12", "12개월"],
            ["24", "24개월"],
          ]}
        />
      </section>

      <div className="flex items-center gap-2">
        <label className="font-medium">최소 데이터(MB):</label>
        <input
          type="number"
          value={minData}
          onChange={(e) => setMinData(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "불러오는 중..." : "요금제 추천받기"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {filtered.length > 0 && (
        <>
          <section className="flex flex-wrap gap-6">
            <ChartCard title="요금제 바 차트">
              <Bar data={barChart} options={chartOptions} />
            </ChartCard>
            <ChartCard title="원가 vs 할인가">
              <Line data={lineChart} options={chartOptions} />
            </ChartCard>
            <ChartCard title="통신사별 요금 비율">
              <Pie data={pieChart} options={chartOptions} />
            </ChartCard>
            <ChartCard title="통신사별 평균 요금">
              <ul className="list-disc pl-6 text-sm overflow-auto">
                {avgByTel.map((item, i) => (
                  <li key={i}>
                    {item.tel}: {item.avg.toLocaleString()}원
                  </li>
                ))}
              </ul>
            </ChartCard>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow bg-white space-y-1"
              >
                <h2 className="text-lg font-semibold">{item.planName}</h2>
                <p>📞 통신사: {item.telecom}</p>
                <p>
                  💸 원가: {item.price}원 / 할인가: {item.discountPrice}원
                </p>
                <p>🗣 음성: {item.voice}</p>
                <p>📶 데이터: {item.data}</p>
                <p>✉ 문자: {item.sms}</p>
                <p>🏅 순위: {item.rank}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

// 💡 공통 차트 카드 컴포넌트
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
