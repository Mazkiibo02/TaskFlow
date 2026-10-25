import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../pages/TaskList';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock the components inside Fluent UI if they cause issues, but generally testing-library works.
// Mock API with realistic delays
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

describe('Task Management Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should load, filter, search, and paginate tasks in complete workflow', async () => {
    const mockTasks = Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      title: `Task ${i + 1}`,
      status: i % 3 === 0 ? 'Done' : i % 3 === 1 ? 'In Progress' : 'To Do',
      customFields: {}
    }));

    mockApiServer.getTasks.mockResolvedValue(mockTasks);
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Verify pagination shows page 1 of 3 (12 tasks / 5 per page)
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();

    // Search for specific task
    const searchInput = screen.getByLabelText('Search tasks by title');
    await userEvent.type(searchInput, 'Task 2');

    await waitFor(() => {
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });

    // Clear search
    await userEvent.clear(searchInput);

    // Filter by status
    const filterDropdown = screen.getByLabelText('Filter tasks by status');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      const filteredTasks = mockTasks.filter(t => t.status === 'Done');
      expect(screen.getByText(`Showing ${filteredTasks.length} of ${filteredTasks.length} tasks`)).toBeInTheDocument();
    });

    // Navigate to next page
    const nextButton = screen.getByLabelText(/Go to next page/);
    await userEvent.click(nextButton);

    expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();
  });

  test('should handle task creation and reflect changes immediately', async () => {
    const initialTasks = [{ id: '1', title: 'Existing Task', status: 'To Do', customFields: {} }];
    const newTask = { id: '2', title: 'New Task', status: 'To Do', customFields: {} };

    mockApiServer.getTasks
      .mockResolvedValueOnce(initialTasks)
      .mockResolvedValueOnce([...initialTasks, newTask]);
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });
    mockApiServer.createTask.mockResolvedValue(newTask);

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Existing Task')).toBeInTheDocument();
    });

    // Open add dialog
    const addButton = screen.getByText('Add New Task');
    await userEvent.click(addButton);

    // Fill form and submit (mock)
    mockApiServer.getTasks.mockResolvedValueOnce([...initialTasks, newTask]);

    const submitButton = screen.getByText('Save');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  test('should show context-aware empty state messages', async () => {
    mockApiServer.getTasks.mockResolvedValue([
      { id: '1', title: 'Test Task', status: 'To Do', customFields: {} }
    ]);
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    // Search with no results
    const searchInput = screen.getByLabelText('Search tasks by title');
    await userEvent.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No tasks match "nonexistent"')).toBeInTheDocument();
    });

    // Clear search and filter
    await userEvent.clear(searchInput);
    const filterDropdown = screen.getByLabelText('Filter tasks by status');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      expect(screen.getByText('No tasks with status "Done"')).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    mockApiServer.getTasks.mockRejectedValue(new Error('Network error'));
    mockApiServer.getFormSettings.mockResolvedValue({ fields: [] });

    render(
      <ToastProvider>
        <TaskList />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });
});
