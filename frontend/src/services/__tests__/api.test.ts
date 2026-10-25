import { fetchTasks, updateTask, deleteTask } from '../api';
import { TasksApiResponse, ApiResponse } from '../../types/api';

describe('API Services', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchTasks', () => {
    test('should return tasks when API responds successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'To Do', customFields: {} },
        { id: '2', title: 'Task 2', status: 'In Progress', customFields: {} }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTasks
        } as TasksApiResponse)
      });

      const result = await fetchTasks('default-org');

      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks')
      );
    });

    test('should throw error when API returns error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Failed to fetch tasks'
        })
      });

      await expect(fetchTasks('default-org')).rejects.toThrow('Failed to fetch tasks');
    });

    test('should throw error when network request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchTasks('default-org')).rejects.toThrow('Network error');
    });
  });

  describe('updateTask', () => {
    test('should send PUT request with correct payload', async () => {
      const updatedTask = { id: '1', title: 'Updated Task', status: 'Done' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: updatedTask
        } as ApiResponse)
      });

      const result = await updateTask('1', { title: 'Updated Task' });

      expect(result).toEqual(updatedTask);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  });

  describe('deleteTask', () => {
    test('should send DELETE request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 204
      });

      await deleteTask('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
