import request from 'supertest';
import { app } from '../src/app';

describe('Health Checks & API Gateway Infrastructure', () => {
  it('GET /api/health should return 200 with database liveness check', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.services.database.status).toBe('healthy');
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /api/v1/health should return versioned health probe with apiVersion v1', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.apiVersion).toBe('v1');
    expect(res.body.services.api).toBe('healthy');
    expect(res.body.services.database.status).toBe('healthy');
  });

  it('GET /api/nonexistent-route should return structured 404 JSON', async () => {
    const res = await request(app).get('/api/nonexistent-route-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('API endpoint not found');
    expect(res.body.requestId).toBeDefined();
  });
});
