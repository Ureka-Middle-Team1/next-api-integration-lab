'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const pg_token = searchParams.get('pg_token');
    const tid = sessionStorage.getItem('kakaopay_tid');

    if (pg_token && tid) {
      fetch(`/api/kakaopay/approve?pg_token=${pg_token}&tid=${tid}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('결제 승인 완료:', data);
          setApproved(true);
        });
    }
  }, [searchParams]);

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl">
        ✅ 결제가 {approved ? '성공적으로 완료' : '진행 중'}되었습니다!
      </h1>
    </main>
  );
}
