import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        paymentKey,
        orderId,
        amount: Number(amount),
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, paymentInfo: response.data });
  } catch (error: any) {
    console.error("결제 승인 실패", error.response?.data);
    return NextResponse.json({ success: false, error: error.response?.data }, { status: 400 });
  }
}
