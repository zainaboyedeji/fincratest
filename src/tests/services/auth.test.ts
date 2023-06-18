
import env from '@/config/env';
import { NotFoundError } from '@/errors/NotFoundError';
import User from '@/models/User';
import AuthService from '@/services/auth.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



describe('AuthService', () => {
  let authService: AuthService;
  let findOneSpy: jest.SpyInstance;
  let compareSpy: jest.SpyInstance;
  let signSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a new instance of the AuthService before each test
    authService = new AuthService();

    // Mock the User.findOne method
    findOneSpy = jest.spyOn(User, 'findOne');
    // Mock the bcrypt.compare method
    compareSpy = jest.spyOn(bcrypt, 'compare');
    // Mock the jwt.sign method
    signSpy = jest.spyOn(jwt, 'sign');
  });

  afterEach(() => {
    // Restore the original implementations after each test
    findOneSpy.mockRestore();
    compareSpy.mockRestore();
    signSpy.mockRestore();
  });

  describe('login', () => {
    it('should return the user and a token when valid credentials are provided', async () => {
      const name = 'John Doe';
      const username = 'testuser';
      const password = 'password123';

      // Mock the User.findOne method to return a user
      findOneSpy.mockResolvedValueOnce(new User({ name, username, password: await bcrypt.hash(password, 10) }));

      // Mock the bcrypt.compare method to return true
      compareSpy.mockResolvedValueOnce(true);

      // Mock the jwt.sign method to return a token
      const token = 'jwt-token';
      signSpy.mockReturnValueOnce(token);

      // Call the login method
      const result = await authService.login({ username, password });

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith({ username });
      expect(compareSpy).toHaveBeenCalledWith(password, expect.any(String));
      expect(signSpy).toHaveBeenCalledWith({ user: expect.any(Object) }, env.jwtSecret, { expiresIn: '2d' });
      expect(result).toEqual({
        _id: expect.anything(),
        name,
        role: 'user',
        username,
        token: expect.any(String),
      });
    });

    it('should throw a NotFoundError when invalid credentials are provided', async () => {
      const username = 'testuser';
      const password = 'password123';

      // Mock the User.findOne method to return null
      findOneSpy.mockResolvedValueOnce(null);

      // Call the login method and expect it to throw a NotFoundError
      await expect(authService.login({ username, password })).rejects.toThrow(NotFoundError);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith({ username });
      expect(compareSpy).not.toHaveBeenCalled();
      expect(signSpy).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundError when the password is incorrect', async () => {
      const username = 'testuser';
      const password = 'password123';

      // Mock the User.findOne method to return a user
      findOneSpy.mockResolvedValueOnce({ username, password: await bcrypt.hash('wrongpassword', 10) });

      // Mock the bcrypt.compare method to return false
      compareSpy.mockResolvedValueOnce(false);

      // Call the login method and expect it to throw a NotFoundError
      await expect(authService.login({ username, password })).rejects.toThrow(NotFoundError);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith({ username });
      expect(compareSpy).toHaveBeenCalledWith(password, expect.any(String));
      expect(signSpy).not.toHaveBeenCalled();
    });
  });
});
