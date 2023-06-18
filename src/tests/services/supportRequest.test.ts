import { NotFoundError } from "@/errors/NotFoundError";
import SupportRequest from "@/models/SupportRequest";
import SupportRequestService from "@/services/supportRequest.service";

describe('SupportRequestService', () => {
  let supportRequestService: SupportRequestService;
  let createSpy: jest.SpyInstance;
  let findSpy: jest.SpyInstance;
  let findByIdSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a new instance of the SupportRequestService before each test
    supportRequestService = new SupportRequestService();

    // Mock the SupportRequest.create method
    createSpy = jest.spyOn(SupportRequest, 'create');
    // Mock the SupportRequest.find method
    findSpy = jest.spyOn(SupportRequest, 'find');
    // Mock the SupportRequest.findById method
    findByIdSpy = jest.spyOn(SupportRequest, 'findById');
    // Mock the SupportRequest.save method
    saveSpy = jest.spyOn(SupportRequest.prototype, 'save');
  });

  afterEach(() => {
    // Restore the original implementations after each test
    createSpy.mockRestore();
    findSpy.mockRestore();
    findByIdSpy.mockRestore();
    saveSpy.mockRestore();
  });

  describe('createSupportRequest', () => {
    it('should create a new support request', async () => {
      const data = { title: 'Support Request 1', description: 'Description 1', status: 'Open', createdBy: 'User 1' };

      // Mock the SupportRequest.create method to return the created support request
      const createdSupportRequest = { ...data, _id: '123' };
      createSpy.mockResolvedValueOnce(createdSupportRequest);

      // Call the createSupportRequest method
      const result = await supportRequestService.createSupportRequest(data);

      // Assert the expected behavior
      expect(createSpy).toHaveBeenCalledWith(data);
      expect(result).toEqual(createdSupportRequest);
    });
  });

  describe('updateSupportRequest', () => {
    it('should update a support request when found', async () => {
      const id = '123';
      const data = { status: 'Closed', assignee: 'User 2' };
      const supportRequest = { _id: id, title: 'Support Request 1', status: 'Open', set: jest.fn(),  save: saveSpy};

      // Mock the SupportRequest.findById method to return a support request
      findByIdSpy.mockResolvedValueOnce(supportRequest);

      // Mock the SupportRequest.save method to return the updated support request
      const updatedSupportRequest = { ...supportRequest, ...data };
      saveSpy.mockResolvedValueOnce(updatedSupportRequest);

      // Call the updateSupportRequest method
      const result = await supportRequestService.updateSupportRequest(id, data);

      // Assert the expected behavior
      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(updatedSupportRequest);
    });

    it('should throw NotFoundError when support request is not found', async () => {
      const id = '123';
      const data = { status: 'Closed' };

      // Mock the SupportRequest.findById method to return null
      findByIdSpy.mockResolvedValueOnce(null);

      // Call the updateSupportRequest method and expect it to throw a NotFoundError
      await expect(supportRequestService.updateSupportRequest(id, data)).rejects.toThrow(NotFoundError);

      // Assert the expected behavior
      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
