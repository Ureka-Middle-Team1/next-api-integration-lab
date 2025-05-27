import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { itemName, totalPrice } = body;

  try {
    const response = await axios.post(
      'https://open-api.kakaopay.com/online/v1/payment/ready',
      {
        cid: process.env.NEXT_PUBLIC_KAKAOPAY_CLIENT_ID,
        partner_order_id: 'ORDER1234',
        partner_user_id: 'user123',
        item_name: itemName,
        quantity: 1,
        total_amount: totalPrice,
        tax_free_amount: 0,
        approval_url: process.env.NEXT_PUBLIC_KAKAOPAY_APPROVAL_URL,
        cancel_url: process.env.NEXT_PUBLIC_KAKAOPAY_CANCEL_URL,
        fail_url: process.env.NEXT_PUBLIC_KAKAOPAY_FAIL_URL,
      },
      {
        headers: {
          Authorization: `SECRET_KEY ${process.env.KAKAOPAY_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error('결제 준비 오류:', err?.response?.data || err.message);
    return NextResponse.json({ error: '카카오페이 준비 실패' }, { status: 500 });
  }
}
