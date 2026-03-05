const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paytrack User Sync API',
      version: '1.0.0',
      description: 'API REST para sincronização de usuários via RandomUser API',

    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Sync',
        description: 'Sincronização de usuários',
      },
      {
        name: 'Users',
        description: 'Consulta de usuários',
      },
    ],
    components: {
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
        SyncResult: {
          type: 'object',
          properties: {
            executionId: {
              type: 'string',
              format: 'uuid',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            total: {
              type: 'integer',
            },
            processed: {
              type: 'integer',
            },
            inserted: {
              type: 'integer',
            },
            updated: {
              type: 'integer',
            },
            ignored: {
              type: 'integer',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            warnings: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            duration: {
              type: 'string',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            first_name: {
              type: 'string',
            },
            last_name: {
              type: 'string',
            },
            age: {
              type: 'integer',
            },
            gender: {
              type: 'string',
            },
            country: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
  apis: ['./src/api/swagger/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
