import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken, generateToken, extractTokenFromHeader } from '../lib/jwt';

// Mock jsonwebtoken
vi.mock('jsonwebtoken');

describe('JWT utilities', () => {
  const mockSecret = 'test-secret';
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = mockSecret;
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const mockPayload = {
        sub: '1',
        email: 'test@example.com',
        username: 'testuser',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => mockPayload);

      const result = verifyToken('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'your-secret-key');
      expect(result).toEqual(mockPayload);
    });

    it('should return null for invalid token', () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = verifyToken('invalid-token');

      expect(jwt.verify).toHaveBeenCalledWith(
        'invalid-token',
        'your-secret-key'
      );
      expect(result).toBeNull();
    });

    it('should handle expired token', () => {
      const mockJwtVerify = vi.mocked(jwt.verify);
      mockJwtVerify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      const result = verifyToken('expired-token');

      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate token with correct payload', () => {
      const mockToken = 'generated.jwt.token';
      const mockJwtSign = vi.mocked(jwt.sign);
      mockJwtSign.mockImplementation(() => mockToken);

      const payload = {
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const result = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          sub: '1',
          email: 'test@example.com',
          username: 'testuser',
        },
        'your-secret-key',
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'abc123.def456.ghi789';
      const authHeader = `Bearer ${token}`;

      const result = extractTokenFromHeader(authHeader);

      expect(result).toBe(token);
    });

    it('should return null for null header', () => {
      const result = extractTokenFromHeader(null);
      expect(result).toBeNull();
    });

    it('should return null for invalid header format', () => {
      const result = extractTokenFromHeader('Invalid header');
      expect(result).toBeNull();
    });

    it('should return null for header without Bearer prefix', () => {
      const result = extractTokenFromHeader('Basic dXNlcjpwYXNz');
      expect(result).toBeNull();
    });

    it('should return null for empty Bearer header', () => {
      const result = extractTokenFromHeader('Bearer ');
      expect(result).toBe('');
    });
  });
});
