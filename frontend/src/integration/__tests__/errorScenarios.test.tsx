import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../pages/TaskList';
import { ToastProvider } from '../../contexts/ToastContext';

const mockApiServer = {
  getTasks: jest.fn(),
  getFormSettings: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
};

jest.mock('../../services/api', () => ({
  fetchTasks: () => mockApiServer.getTasks(),
  fetchFormSettings: () => mockApiServer.getFormSettings(),
  createTask: (task: any) => mockApiServer.createTask(task),
  updateTask: (id: string, task: any) => mockApiServer.updateTask(id, task),
  deleteTask: (id: string) => mockApiServer.deleteTask(id)
}));

describe('Error Handling & Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle empty task list', async () => {
    mockApiServer.getTasks.mockResolvedValue([]);
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No tasks found. Create one to get started.')).toBeInTheDocument();
    });
  });

  test('should handle very large task lists (1000+ tasks)', async () => {
    const largeTasks = Array.from({ length: 1001 }, (_, i) => ({
      id: String(i),
      title: `Task ${i}`,
      status: 'To Do',
      customFields: {}
    }));

    mockApiServer.getTasks.mockResolvedValue(largeTasks);
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    await waitFor(() => {
      // 1001 tasks / 5 per page = 201 pages
      expect(screen.getByText(/Page 1 of 201/)).toBeInTheDocument();
    });
  });

  test('should handle concurrent API calls', async () => {
    const mockTasks = [{ id: '1', title: 'Task 1', status: 'To Do', customFields: {} }];

    mockApiServer.getTasks.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockTasks), 100))
    );
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );
    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Task 1')).toHaveLength(2);
    });
  });
});
