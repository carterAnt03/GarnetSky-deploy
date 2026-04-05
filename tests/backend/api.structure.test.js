// tests/backend/api.structure.test.js
// Tests for consistent API response structures

describe('API Response Structure', () => {
  describe('Success Responses', () => {
    it('should have consistent success structure', () => {
      const successResponse = {
        success: true,
        data: {},
        message: 'Operation successful'
      };
      
      expect(successResponse).toHaveProperty('success');
      expect(successResponse).toHaveProperty('data');
      expect(successResponse.success).toBe(true);
    });

    it('should include pagination metadata for list endpoints', () => {
      const paginatedResponse = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          pages: 10
        }
      };
      
      expect(paginatedResponse).toHaveProperty('pagination');
      expect(paginatedResponse.pagination).toHaveProperty('page');
      expect(paginatedResponse.pagination).toHaveProperty('limit');
      expect(paginatedResponse.pagination).toHaveProperty('total');
    });
  });

  describe('Error Responses', () => {
    it('should have consistent error structure', () => {
      const errorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input provided',
          details: []
        }
      };
      
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toHaveProperty('code');
      expect(errorResponse.error).toHaveProperty('message');
    });

    it('should include validation details when applicable', () => {
      const validationError = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: [
            { field: 'email', message: 'Email is required' },
            { field: 'password', message: 'Password too short' }
          ]
        }
      };
      
      expect(validationError.error.details.length).toBeGreaterThan(0);
    });
  });

  describe('Status Codes', () => {
    const statusCodes = {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      SERVER_ERROR: 500
    };

    it('should use appropriate status codes', () => {
      expect(statusCodes.OK).toBe(200);
      expect(statusCodes.CREATED).toBe(201);
      expect(statusCodes.BAD_REQUEST).toBe(400);
      expect(statusCodes.UNAUTHORIZED).toBe(401);
      expect(statusCodes.NOT_FOUND).toBe(404);
    });
  });
});