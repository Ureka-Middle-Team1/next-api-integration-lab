'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function KakaoPayPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/kakaopay/initiate', {
        itemName: '테스트상품',
        totalPrice: 20000,
      });

      if (res.data.tid) {
        sessionStorage.setItem('kakaopay_tid', res.data.tid);
      }

      router.push(res.data.next_redirect_pc_url);
    } catch (err) {
      alert('결제 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl mb-6">💳 카카오페이 테스트 결제</h1>
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-5 py-3 text-lg bg-[#FEE500] rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? '요청 중...' : '결제하기'}
      </button>
    </main>
  );
}
