// DB 없는 API
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message") || "Hello from GET!";
  return NextResponse.json({ received: message });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message || "Hello from POST!";
  return NextResponse.json({ received: message });
}
