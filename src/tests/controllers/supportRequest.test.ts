import { Request, Response } from "express";
import User, { IUser } from "@/models/User";
import { AuthRequest } from "@/types/request";
import UserController from "@/controllers/user.controller";
import UserService from "@/services/user.service";
import { AlreadyExistError } from "@/errors/AlreadyExistError";
import SupportRequestService from "@/services/supportRequest.service";
import SupportRequestController from "@/controllers/supportRequest.controller";
import SupportRequest from "@/models/SupportRequest";
import { NotFoundError } from "@/errors/NotFoundError";
import json2csv from "json2csv";
import pdf from "html-pdf";

// Mock the SupportRequestService
jest.mock("@/services/supportRequest.service");

describe("SupportRequestController", () => {
  let supportRequestService: SupportRequestService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // Initialize mocks and request/response objects
    supportRequestService = new SupportRequestService();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
      pipe: jest.fn(),
    } as unknown as Response;
  });

  describe("createSupportRequest", () => {
    it("should create a support request and return status 201 with the request data", async () => {
      const createRequestPayload = {
        title: "Test Request",
        description: "This is a test request",
      };
      const createdRequest = new SupportRequest({ ...createRequestPayload});

      // Mock the createSupportRequest method
      const createSupportRequestMock = jest.spyOn(supportRequestService, "createSupportRequest").mockResolvedValueOnce(createdRequest);

      const authReq = { body: createRequestPayload, user: { _id: "user-id" } } as AuthRequest;
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.createSupportRequest(authReq, res);

      expect(createSupportRequestMock).toHaveBeenCalledWith({ ...createRequestPayload, createdBy: "user-id" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: createdRequest });
    });

    it("should return an error and status 404 when the request already exists", async () => {
      const createRequestPayload = {
        title: "Test Request",
        description: "This is a test request",
      };

      // Mock the createSupportRequest method to throw an AlreadyExistError
      const alreadyExistError = new AlreadyExistError("Request already exists");
      jest.spyOn(supportRequestService, "createSupportRequest").mockRejectedValueOnce(alreadyExistError);

      const authReq = { body: createRequestPayload, user: { _id: "user-id" } } as AuthRequest;
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.createSupportRequest(authReq, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: alreadyExistError.message });
    });

    it("should return an error and status 500 when something goes wrong", async () => {
      const createRequestPayload = {
        title: "Test Request",
        description: "This is a test request",
      };

      // Mock the createSupportRequest method to throw an error
      const errorMessage = "Database error";
      jest.spyOn(supportRequestService, "createSupportRequest").mockRejectedValueOnce(new Error(errorMessage));

      const authReq = { body: createRequestPayload, user: { _id: "user-id" } } as AuthRequest;
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.createSupportRequest(authReq, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong, please contact support if issue persists!" });
    });
  });

  describe("listSupportRequests", () => {
    it("should return a list of support requests and status 201", async () => {
      const supportRequests = [
        new SupportRequest({ title: "Request 1", description: "Description 1" }),
        new SupportRequest({ title: "Request 2", description: "Description 2" }),
      ];

      // Mock the listSupportRequests method
      const listSupportRequestsMock = jest.spyOn(supportRequestService, "listSupportRequests").mockResolvedValueOnce(supportRequests);

      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.listSupportRequests(req, res);

      expect(listSupportRequestsMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: supportRequests });
    });

    it("should return an error and status 500 when something goes wrong", async () => {
      // Mock the listSupportRequests method to throw an error
      const errorMessage = "Database error";
      jest.spyOn(supportRequestService, "listSupportRequests").mockRejectedValueOnce(new Error(errorMessage));

      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.listSupportRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong, please contact support if issue persists!" });
    });
  });

  describe("updateSupportRequest", () => {
    it("should update a support request and return status 201 with the updated request", async () => {
      const updateRequestPayload = {
        status: "in progress",
        assignee: "user-id",
      };
      const updatedRequest = new SupportRequest({ title: "Test Request", description: "This is a test request", ...updateRequestPayload });

      // Mock the updateSupportRequest method
      const updateSupportRequestMock = jest.spyOn(supportRequestService, "updateSupportRequest").mockResolvedValueOnce(updatedRequest);

      const authReq = { params: { id: "request-id" }, body: updateRequestPayload, user: new User({name: "Zainab"}) } as any;
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.updateSupportRequest(authReq, res);

      expect(updateSupportRequestMock).toHaveBeenCalledWith("request-id", updateRequestPayload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: updatedRequest });
    });

    it("should return an error and status 404 when the request is not found", async () => {
      const updateRequestPayload = {
        status: "in progress",
        assignee: "user-id",
      };

      // Mock the updateSupportRequest method to throw a NotFoundError
      const notFoundError = new NotFoundError("Request not found");
      jest.spyOn(supportRequestService, "updateSupportRequest").mockRejectedValueOnce(notFoundError);

      const authReq = { params: { id: "request-id" }, body: updateRequestPayload, user: { _id: "user-id" } } as any;
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.updateSupportRequest(authReq, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: notFoundError.message });
    });
  });

  describe("exportSupportRequest", () => {
    it("should export support requests in CSV format", async () => {
      const supportRequests = [
        new SupportRequest({ title: "Request 1", description: "Description 1", assignee: new User({ name: "User 1"}), createdBy: new User({ name: "User 2"}) }),
        new SupportRequest({ title: "Request 2", description: "Description 2", assignee: new User({ name: "User 3"}), createdBy: new User({ name: "User 4"}) }),
      ];

      // Mock the listSupportRequests method
      jest.spyOn(supportRequestService, "listSupportRequests").mockResolvedValueOnce(supportRequests);

      // Mock the json2csv parse method
      const json2csvParseMock = jest.spyOn(json2csv, "parse").mockReturnValueOnce("csv-data");

      const format = "csv";
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.exportSupportRequest({ params: { format } } as any, res);

      expect(json2csvParseMock).toHaveBeenCalledWith([
        {
          title: "Request 1",
          description: "Description 1",
          status: "open",
          assignee: "User 1",
          createdBy: "User 2"
        },
        {
          title: "Request 2",
          description: "Description 2",
          status: "open",
          assignee: "User 3",
          createdBy: "User 4"
          
        },
      ]);

      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
      expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=data.csv");
      expect(res.send).toHaveBeenCalledWith("csv-data");
    });

    it("should export support requests in PDF format", async () => {
      const supportRequests = [
        new SupportRequest({ title: "Request 1", description: "Description 1", assignee: new User({ name: "User 1"}), createdBy: new User({ name: "User 2"}) }),
        new SupportRequest({ title: "Request 2", description: "Description 2", assignee: new User({ name: "User 3"}), createdBy: new User({ name: "User 4"}) }),
      ];

      // Mock the listSupportRequests method
      jest.spyOn(supportRequestService, "listSupportRequests").mockResolvedValueOnce(supportRequests);

      const stream = {
        pipe: jest.fn(),
      };

      // Mock the pdf create method
      const pdfCreateMock = jest.spyOn(pdf, "create").mockReturnValueOnce({
        toStream: (cb: Function) => cb(null, stream),
      } as unknown as pdf.CreateResult);

      const format = "pdf";
      const supportRequestController = new SupportRequestController(supportRequestService);

      await supportRequestController.exportSupportRequest({ params: { format } } as any, res);

      expect(pdfCreateMock).toHaveBeenCalledWith(expect.any(String), {"format": "Letter"}); // Mock the HTML content

      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
      expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=data.pdf");
      expect(stream.pipe).toHaveBeenCalled();
    });


  });
});
