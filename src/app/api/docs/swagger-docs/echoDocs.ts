export const echoDocs = `
/**
 * @swagger
 * /api/echo:
 *   get:
 *     summary: Echo GET 요청
 *     description: 쿼리 파라미터로 전달된 메시지를 그대로 반환합니다.
 *     parameters:
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         required: true
 *         description: 전달할 메시지
 *     responses:
 *       200:
 *         description: 받은 메시지 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: string
 *       400:
 *         description: 메시지 누락
 */

/**
 * @swagger
 * /api/echo:
 *   post:
 *     summary: Echo POST 요청
 *     description: JSON 본문으로 전달된 메시지를 그대로 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "반갑습니다"
 *     responses:
 *       200:
 *         description: 받은 메시지 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: string
 *       400:
 *         description: 메시지 누락
 */
`;
