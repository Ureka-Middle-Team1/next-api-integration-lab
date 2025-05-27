import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pg_token = searchParams.get('pg_token');
  const tid = searchParams.get('tid');

  if (!pg_token || !tid) {
    return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      'https://open-api.kakaopay.com/online/v1/payment/approve',
      {
        cid: 'TC0ONETIME',
        tid,
        partner_order_id: 'ORDER1234',
        partner_user_id: 'user123',
        pg_token,
      },
      {
        headers: {
          Authorization: `SECRET_KEY ${process.env.KAKAO_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error('결제 승인 오류:', err?.response?.data || err.message);
    return NextResponse.json({ error: '카카오페이 승인 실패' }, { status: 500 });
  }
}
