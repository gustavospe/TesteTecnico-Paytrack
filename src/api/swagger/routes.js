/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check
 *     description: Verifica se a API está online e funcionando
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API está online"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 1234.56
 */

/**
 * @swagger
 * /api/sync:
 *   post:
 *     summary: Executar Sincronização
 *     description: Executa a sincronização de usuários da API externa (RandomUser)
 *     tags: [Sync]
 *     responses:
 *       200:
 *         description: Sincronização executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SyncResult'
 *       500:
 *         description: Erro durante a sincronização
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/sync/status:
 *   get:
 *     summary: Status da Última Sincronização
 *     description: Retorna informações da última sincronização executada
 *     tags: [Sync]
 *     responses:
 *       200:
 *         description: Status retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SyncResult'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar Usuários
 *     description: Lista usuários do banco de dados com paginação e filtros
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Quantidade de registros
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset para paginação
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filtrar por país
 *         example: BR
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Idade mínima
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Idade máxima
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/users/stats/summary:
 *   get:
 *     summary: Estatísticas de Usuários
 *     description: Retorna estatísticas agregadas dos usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Estatísticas geradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byCountry:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           country:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     byGender:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           gender:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     ageStats:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: integer
 *                         max:
 *                           type: integer
 *                         avg:
 *                           type: number
 */

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Buscar Usuário por Email
 *     description: Busca um usuário específico pelo email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do usuário
 *         example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
