import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 메시지 추가 (POST)
/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: 메시지 저장
 *     description: 사용자가 입력한 메시지를 데이터베이스에 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "안녕하세요"
 *     responses:
 *       200:
 *         description: 저장된 메시지 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 메시지 누락
 */
export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "메시지가 필요합니다." }, { status: 400 });
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
/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: 메시지 목록 조회
 *     description: 최근 저장된 메시지 10개를 조회합니다.
 *     responses:
 *       200:
 *         description: 메시지 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       message:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
export async function GET() {
  const messages = await prisma.echoMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ messages });
}
