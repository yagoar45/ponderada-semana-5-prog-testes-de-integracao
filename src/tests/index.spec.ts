import request from 'supertest';
import { server } from '../index';

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Express with TypeScript!');
  });
});

describe('GET /temperature-converter', () => {
  it('should return the correct conversion from Fahrenheit to Celsius', async () => {
    const response = await request(server).get('/temperature-converter?fahrenheit=32');
    expect(response.status).toBe(200);
    expect(response.body.fahrenheit).toBe(32);
    expect(response.body.celsius).toBe(0);
  });
});

afterAll(() => {
  server.close();
});
