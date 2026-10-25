describe('API Response Format Validation', () => {
  test('GET /api/tasks returns correct schema', async () => {
    const response = await fetch('http://localhost:7071/api/tasks');
    const data = await response.json();

    // Validate response structure
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);

    if (data.data.length > 0) {
      const task = data.data[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(['To Do', 'In Progress', 'Done']).toContain(task.status);
    }
  });

  test('POST /api/tasks rejects invalid input', async () => {
    const invalidTask = { title: '' }; // Empty title

    const response = await fetch('http://localhost:7071/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidTask)
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  test('GET /api/tasks/{id} returns 404 for nonexistent task', async () => {
    const response = await fetch('http://localhost:7071/api/tasks/nonexistent-id');

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('not found');
  });
});
