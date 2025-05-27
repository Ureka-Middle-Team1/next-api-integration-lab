'use client';

import { useState } from 'react';
import axios from 'axios';

export default function KakaoPayPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/kakaopay/ready', {
        itemName: '테스트상품',
        totalPrice: 20000,
      });

      if (res.data.tid) {
        sessionStorage.setItem('kakaopay_tid', res.data.tid);
      }

      window.location.href = res.data.next_redirect_pc_url;
    } catch (err) {
      alert('결제 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1>💳 카카오페이 테스트 결제</h1>
      <button
        onClick={handlePay}
        disabled={loading}
        style={{ padding: '12px 20px', fontSize: '18px', backgroundColor: '#FEE500', borderRadius: '8px' }}
      >
        {loading ? '요청 중...' : '결제하기'}
      </button>
    </main>
  );
}