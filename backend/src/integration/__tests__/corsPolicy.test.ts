describe('CORS Policy Enforcement', () => {
  test('should allow request from whitelisted origin', async () => {
    const response = await fetch('http://localhost:7071/api/tasks', {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  test('should reject request from non-whitelisted origin', async () => {
    const response = await fetch('http://localhost:7071/api/tasks', {
      headers: {
        'Origin': 'http://malicious-site.com'
      }
    });

    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('should allow all whitelisted origins', async () => {
    const origins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

    for (const origin of origins) {
      const response = await fetch('http://localhost:7071/api/tasks', {
        headers: { 'Origin': origin }
      });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    }
  });
});
