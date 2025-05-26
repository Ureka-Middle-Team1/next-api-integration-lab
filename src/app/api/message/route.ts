import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 메시지 추가 (POST)
export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json(
      { error: "메시지가 필요합니다." },
      { status: 400 }
    );
  }

  const saved = await prisma.echoMessage.create({
    data: { message },
  });

  return NextResponse.json({
    id: saved.id,
    message: saved.message,
    createdAt: saved.createdAt,
  });
}

// 메시지 조회 (GET)
export async function GET() {
  const messages = await prisma.echoMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ messages });
}
