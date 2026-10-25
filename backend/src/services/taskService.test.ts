import { createTask } from "./taskService";
import { ZodError } from "zod";
import * as cosmosConfig from "../config/cosmos";

// Mock the Cosmos DB container
jest.mock("../config/cosmos", () => ({
  getTasksContainer: jest.fn()
}));

describe("taskService", () => {
  describe("createTask", () => {
    it("should create a task successfully with valid data", async () => {
      const mockContainer = {
        items: {
          create: jest.fn().mockResolvedValue({ resource: { id: "123", title: "Test Task", status: "To Do" } })
        }
      };
      (cosmosConfig.getTasksContainer as jest.Mock).mockResolvedValue(mockContainer);

      const validTaskData = {
        title: "Test Task",
        status: "To Do"
      };

      const result = await createTask(validTaskData);

      expect(mockContainer.items.create).toHaveBeenCalledWith(expect.objectContaining(validTaskData));
      expect(result).toHaveProperty("id", "123");
      expect(result).toHaveProperty("title", "Test Task");
    });

    it("should throw a ZodError when creating a task with invalid data (missing title)", async () => {
      const invalidTaskData = {
        status: "To Do"
      };

      await expect(createTask(invalidTaskData)).rejects.toThrow(ZodError);
    });

    it("should throw a ZodError when creating a task with invalid status", async () => {
      const invalidTaskData = {
        title: "Test Task",
        status: "Invalid Status"
      };

      await expect(createTask(invalidTaskData)).rejects.toThrow(ZodError);
    });
  });
});
