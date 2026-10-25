import { fetchTasks, fetchFormSettings } from "./api";

// Mock global fetch
global.fetch = jest.fn();

describe("Frontend API Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchTasks", () => {
    it("should unwrap a successful standardized response", async () => {
      const mockTasks = [{ id: "1", title: "Task 1", status: "To Do" }];
      
      // Our backend returns { success: true, data: [...] }
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTasks })
      });

      const result = await fetchTasks();
      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:7071/api/tasks");
    });

    it("should throw an error if success is false, even if ok is true", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, message: "Validation Error" })
      });

      await expect(fetchTasks()).rejects.toThrow("Validation Error");
    });

    it("should throw an error if the HTTP response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Internal Server Error" })
      });

      await expect(fetchTasks()).rejects.toThrow("Internal Server Error");
    });
  });

  describe("fetchFormSettings", () => {
    it("should append organizationId properly to the URL", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { organizationId: "test-org", fields: [] } })
      });

      await fetchFormSettings("test-org");
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:7071/api/form-settings?organizationId=test-org");
    });
  });
});
