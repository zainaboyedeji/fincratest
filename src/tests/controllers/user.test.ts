import { Request, Response } from "express";
import User, { IUser } from "@/models/User";
import { AuthRequest } from "@/types/request";
import UserController from "@/controllers/user.controller";
import UserService from "@/services/user.service";
import { AlreadyExistError } from "@/errors/AlreadyExistError";

// Mock the UserService
jest.mock("@/services/user.service");

describe("UserController", () => {
  let userService: UserService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // Initialize mocks and request/response objects
    userService = new UserService();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("getUsers", () => {
    it("should return users and status 200", async () => {
      
      const users = [new User(), new User()]
      const findAllUsersMock = jest.spyOn(userService, "findAllUsers").mockResolvedValueOnce(users);

      const userController = new UserController(userService);

      await userController.getUsers(req, res);

      expect(findAllUsersMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should return an error and status 500 when something goes wrong", async () => {
      // Mock the findAllUsers method to throw an error
      const errorMessage = "Database error";
      jest.spyOn(userService, "findAllUsers").mockRejectedValueOnce(new Error(errorMessage));

      const userController = new UserController(userService);

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong, please contact support if issue persists!" });
    });
  });

  describe("createUser", () => {
    it("should create a user and return status 201 with the user data", async () => {
      const createUserPayload: Partial<IUser> = {
        name: "John Doe",
        username: "johndoe",
        password: "password",
        role: "user",
      };

      const createdUser = new User(createUserPayload);
      

      // Mock the createUser method
      const createUserMock = jest.spyOn(userService, "createUser").mockResolvedValueOnce(createdUser);

      const authReq = { body: createUserPayload, user: { role: "admin" } } as AuthRequest;
      const userController = new UserController(userService);

      await userController.createUser(authReq, res);

      expect(createUserMock).toHaveBeenCalledWith(createUserPayload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: createdUser });
    });

    it("should return an error and status 403 when unauthorized to create a user", async () => {
      const createUserPayload = {
        name: "John Doe",
        username: "johndoe",
        password: "password",
        role: "admin",
      };

      const authReq = { body: createUserPayload, user: { role: "user" } } as AuthRequest;
      const userController = new UserController(userService);

      await userController.createUser(authReq, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "You are not authorized to create a user with this role!" });
    });

    it("should return an error and status 404 when the user already exists", async () => {
      const createUserPayload = {
        name: "John Doe",
        username: "johndoe",
        password: "password",
        role: "user",
      };

      // Mock the createUser method to throw an AlreadyExistError
      const alreadyExistError = new AlreadyExistError("User already exists");
      jest.spyOn(userService, "createUser").mockRejectedValueOnce(alreadyExistError);

      const authReq = { body: createUserPayload, user: { role: "admin" } } as AuthRequest;
      const userController = new UserController(userService);

      await userController.createUser(authReq, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: alreadyExistError.message });
    });

    it("should return an error and status 500 when something goes wrong", async () => {
      const createUserPayload = {
        name: "John Doe",
        username: "johndoe",
        password: "password",
        role: "user",
      };

      // Mock the createUser method to throw an error
      const errorMessage = "Database error";
      jest.spyOn(userService, "createUser").mockRejectedValueOnce(new Error(errorMessage));

      const authReq = { body: createUserPayload, user: { role: "admin" } } as AuthRequest;
      const userController = new UserController(userService);

      await userController.createUser(authReq, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong, please contact support if issue persists!" });
    });
  });
});
