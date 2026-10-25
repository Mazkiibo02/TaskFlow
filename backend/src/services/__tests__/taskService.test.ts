import { getTasks, createTask, updateTask, getTaskById } from '../taskService';
import { Task, TaskSchema } from '../../models/Task';
import * as cosmosConfig from '../../config/cosmos';
import { AppError } from '../../utils/errorHandler';

jest.mock('../../config/cosmos');

describe('Task Service', () => {
  const mockContainer = {
    items: {
      query: jest.fn(),
      create: jest.fn()
    },
    item: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cosmosConfig.getTasksContainer as jest.Mock).mockResolvedValue(mockContainer);
  });

  describe('getTasks', () => {
    test('should return all tasks when no organizationId provided', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'To Do' },
        { id: '2', title: 'Task 2', status: 'Done' }
      ];

      mockContainer.items.query.mockReturnValue({
        fetchAll: jest.fn().mockResolvedValue({ resources: mockTasks })
      });

      const result = await getTasks();

      expect(result).toEqual(mockTasks);
      expect(mockContainer.items.query).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'SELECT * FROM c',
          parameters: []
        })
      );
    });

    test('should filter tasks by organizationId', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1', status: 'To Do', organizationId: 'org-1' }];

      mockContainer.items.query.mockReturnValue({
        fetchAll: jest.fn().mockResolvedValue({ resources: mockTasks })
      });

      const result = await getTasks('org-1');

      expect(result).toEqual(mockTasks);
      expect(mockContainer.items.query).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.stringContaining('WHERE c.organizationId = @orgId'),
          parameters: expect.arrayContaining([
            { name: '@orgId', value: 'org-1' }
          ])
        })
      );
    });
  });

  describe('createTask', () => {
    test('should throw error when title is missing', async () => {
      const invalidTask = { status: 'To Do' };

      await expect(createTask(invalidTask)).rejects.toThrow();
    });

    test('should throw error when title exceeds max length', async () => {
      const invalidTask = { 
        title: 'a'.repeat(256), 
        status: 'To Do' 
      };

      await expect(createTask(invalidTask)).rejects.toThrow('Title too long');
    });

    test('should create task with valid data', async () => {
      const taskData = { title: 'New Task', status: 'To Do' as const };
      const createdTask = { id: '1', ...taskData };

      mockContainer.items.create.mockResolvedValue({
        resource: createdTask
      });

      const result = await createTask(taskData);

      expect(result).toEqual(createdTask);
      expect(mockContainer.items.create).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    test('should throw AppError when task not found', async () => {
      mockContainer.item.mockReturnValue({
        read: jest.fn().mockResolvedValue({ resource: null })
      });

      await expect(updateTask('non-existent', { title: 'Updated' })).rejects.toThrow(AppError);
    });

    test('should merge updates with existing task', async () => {
      const existingTask = { id: '1', title: 'Original', status: 'To Do' };
      const updatedTask = { ...existingTask, title: 'Updated' };

      mockContainer.item.mockReturnValue({
        read: jest.fn().mockResolvedValue({ resource: existingTask }),
        replace: jest.fn().mockResolvedValue({ resource: updatedTask })
      });

      const result = await updateTask('1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });
});
