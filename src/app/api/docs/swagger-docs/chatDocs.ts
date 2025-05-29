export const chatDocs = `
/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: 사용자 메시지 기반 추천 제품 응답
 *     description: 사용자의 메시지를 기반으로 OpenAI API를 통해 제품을 추천합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "고급스럽고 편안한 소파 추천해줘"
 *     responses:
 *       200:
 *         description: 성공적으로 추천 응답을 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *       400:
 *         description: message 누락
 *       500:
 *         description: API 키 없음 또는 OpenAI 호출 실패
 */
`;
