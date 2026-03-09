import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trash Detection API",
      version: "1.0.0",
      description: "API documentation for Trash Detection System",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your access token here",
        },
      },
      schemas: {
        DefaultItem: {
          type: "object",
          required: ["name", "pointToTrade", "imageUrl"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "Gift Card",
            },
            pointToTrade: {
              type: "number",
              example: 100,
            },
            imageUrl: {
              type: "string",
              example: "https://example.com/gift-card.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CustomItem: {
          type: "object",
          required: ["name", "pointToTrade", "imageUrl", "userId", "groupId"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "Premium Gift",
            },
            pointToTrade: {
              type: "number",
              example: 50,
            },
            imageUrl: {
              type: "string",
              example: "https://example.com/premium.jpg",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            groupId: {
              type: "string",
              example: "507f1f77bcf86cd799439013",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        User: {
          type: "object",
          required: ["userName", "password", "firstName", "lastName", "email", "birthDate", "male"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userName: {
              type: "string",
              example: "testuser",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
            birthDate: {
              type: "string",
              format: "date",
              example: "1990-01-01",
            },
            male: {
              type: "boolean",
              example: true,
            },
            points: {
              type: "number",
              example: 0,
            },
            iconUrl: {
              type: "string",
              example: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
            },
          },
        },
        TradeHistory: {
          type: "object",
          required: ["userId", "itemId", "itemName", "quantity", "pointsSpent", "prevPoint", "remainPoint"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            itemId: {
              type: "string",
              example: "507f1f77bcf86cd799439013",
            },
            itemName: {
              type: "string",
              example: "Gift Card",
            },
            quantity: {
              type: "number",
              example: 1,
            },
            pointsSpent: {
              type: "number",
              example: 100,
            },
            prevPoint: {
              type: "number",
              example: 500,
            },
            remainPoint: {
              type: "number",
              example: 400,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);


export { swaggerUi, swaggerSpec }; 
