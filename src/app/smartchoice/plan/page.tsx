'use client';

import { useState } from 'react';
import axios from 'axios';

export default function PlanRecommendationPage() {
  const [form, setForm] = useState({
    voice: '',
    data: '',
    sms: '',
    age: '',
    type: '',
    dis: '',
  });

  const [result, setResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/smartchoice/plan', form);
      const parsed = response.data;
      const items = parsed?.root?.items?.item;

      if (items && Array.isArray(items)) {
        const mapped = items.map((item: any) => ({
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
      setError('오류 발생: ' + (err as any)?.message || '알 수 없는 오류');
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📡 통신요금 추천 API 테스트</h1>

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
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '불러오는 중...' : '요금제 추천받기'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded shadow bg-white space-y-1"
            >
              <h2 className="text-lg font-semibold">{item.planName}</h2>
              <p>📞 통신사: {item.telecom}</p>
              <p>💸 가격: {item.price}원</p>
              <p>🗣 음성: {item.voice}</p>
              <p>📶 데이터: {item.data}</p>
              <p>✉ 문자: {item.sms}</p>
              <p>🏅 순위: {item.rank}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}