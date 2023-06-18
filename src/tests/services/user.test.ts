import { AlreadyExistError } from "@/errors/AlreadyExistError";
import { NotFoundError } from "@/errors/NotFoundError";
import User from "@/models/User";
import UserService from "@/services/user.service";

describe('UserService', () => {
  let userService: UserService;
  let findSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a new instance of the UserService before each test
    userService = new UserService();

    // Mock the User.find method
    findSpy = jest.spyOn(User, 'find');
    // Mock the User.findOne method
    findOneSpy = jest.spyOn(User, 'findOne');
    // Mock the User.create method
    createSpy = jest.spyOn(User, 'create');
  });

  afterEach(() => {
    // Restore the original implementations after each test
    findSpy.mockRestore();
    findOneSpy.mockRestore();
    createSpy.mockRestore();
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [{ name: 'John' }, { name: 'Jane' }];

      // Mock the User.find method to return an array of users
      findSpy.mockResolvedValueOnce(users);

      // Call the findAllUsers method
      const result = await userService.findAllUsers();

      // Assert the expected behavior
      expect(findSpy).toHaveBeenCalledWith({});
      expect(result).toEqual(users);
    });
  });

  describe('find', () => {
    it('should return a user when found', async () => {
      const filter = { username: 'testuser' };
      const user = { username: 'testuser', name: 'John' };

      // Mock the User.findOne method to return a user
      findOneSpy.mockResolvedValueOnce(user);

      // Call the find method
      const result = await userService.find(filter);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith(filter);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundError when user not found', async () => {
      const filter = { username: 'testuser' };

      // Mock the User.findOne method to return null
      findOneSpy.mockResolvedValueOnce(null);

      // Call the find method and expect it to throw a NotFoundError
      await expect(userService.find(filter)).rejects.toThrow(NotFoundError);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith(filter);
    });
  });

  describe('createUser', () => {
    it('should create a new user when username is unique', async () => {
      const data = { name: 'John', username: 'testuser', password: 'password123' };

      // Mock the User.findOne method to return null (indicating the username is unique)
      findOneSpy.mockResolvedValueOnce(null);

      // Mock the User.create method to return the created user
      const createdUser = { ...data, _id: '123' };
      createSpy.mockResolvedValueOnce(createdUser);

      // Call the createUser method
      const result = await userService.createUser(data);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith({ username: data.username });
      expect(createSpy).toHaveBeenCalledWith(data);
      expect(result).toEqual(createdUser);
    });

    it('should throw an AlreadyExistError when username already exists', async () => {
      const data = { name: 'John', username: 'testuser', password: 'password123' };

      // Mock the User.findOne method to return an existing user
      const existingUser = { ...data, _id: '123' };
      findOneSpy.mockResolvedValueOnce(existingUser);

      // Call the createUser method and expect it to throw an AlreadyExistError
      await expect(userService.createUser(data)).rejects.toThrow(AlreadyExistError);

      // Assert the expected behavior
      expect(findOneSpy).toHaveBeenCalledWith({ username: data.username });
      expect(createSpy).not.toHaveBeenCalled();
    });
  });
});
