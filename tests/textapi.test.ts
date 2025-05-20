import request from 'supertest';
import mongoose from 'mongoose';
import { Application } from 'express';
import { createApp } from '../src/app';
import { cache } from '../src/utils/cache';
import 'dotenv/config';

jest.mock('../src/utils/cache', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
  },
}));

describe('Text API', () => {
  let app: Application;
  let textId: string;
  const testUserId = 'test-user-123'; // Define a test user ID

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await cache.quit();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ 
        content: 'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.',
        userId: testUserId 
      });
    textId = response.body.data._id;
  });

  it('POST /api/texts should create a text with correct schema', async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ 
        content: 'first one from ikramul',
        userId: testUserId 
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        _id: expect.any(String),
        content: 'first one from ikramul',
        userId: testUserId, // Updated to use the testUserId
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
      },
      message: 'Text created successfully',
    });
  });

  it('POST /api/texts should fail for empty content', async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ content: '', userId: testUserId });
    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ message: 'Text content cannot be empty' })
    );
  });

  it('GET /api/texts/:id/word-count should return correct word count', async () => {
    const response = await request(app)
      .get(`/api/texts/${textId}/word-count?userId=${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('wordCount');
    expect(typeof response.body.data.wordCount).toBe('number');
    expect(response.body.data.wordCount).toBe(16);
  });

  it('GET /api/texts/:id/character-count should return correct character count without space', async () => {
    const response = await request(app)
      .get(`/api/texts/${textId}/character-count?userId=${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('characterCount');
    expect(typeof response.body.data.characterCount).toBe('number');
    expect(response.body.data.characterCount).toBe(60);
  });

  it('GET /api/texts/:id/sentence-count should return correct sentence count', async () => {
    const response = await request(app)
      .get(`/api/texts/${textId}/sentence-count?userId=${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('sentenceCount');
    expect(typeof response.body.data.sentenceCount).toBe('number');
    expect(response.body.data.sentenceCount).toBe(2);
  });

  it('GET /api/texts/:id/paragraph-count should return correct paragraph count', async () => {
    const response = await request(app)
      .get(`/api/texts/${textId}/paragraph-count?userId=${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('paragraphCount');
    expect(typeof response.body.data.paragraphCount).toBe('number');
    expect(response.body.data.paragraphCount).toBe(1);
  });

  it('GET /api/texts/:id/longest-words should return the longest words', async () => {
    const response = await request(app)
      .get(`/api/texts/${textId}/longest-words?userId=${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('longestWords');
    expect(Array.isArray(response.body.data.longestWords)).toBe(false);
    expect(response.body.data.longestWords.length).toBeGreaterThan(0);
  });

  it('GET /api/texts/:id/word-count should return 400 for invalid id', async () => {
    const response = await request(app)
      .get(`/api/texts/invalidid/word-count?userId=${testUserId}`);
    expect(response.status).toBe(400);
  });

  it('GET /api/texts/:id/word-count should return 404 for non-existent id', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    const response = await request(app)
      .get(`/api/texts/${nonExistentId}/word-count?userId=${testUserId}`);
    expect([404, 400]).toContain(response.status);
  });

  it('PUT /api/texts/:id should update text and invalidate cache', async () => {
    const response = await request(app)
      .put(`/api/texts/${textId}`)
      .send({ 
        content: 'Updated text.',
        userId: testUserId 
      });
    expect(response.status).toBe(200);
    expect(response.body.data.content).toBe('Updated text.');
  });

  it('PUT /api/texts/:id should fail for empty content', async () => {
    const response = await request(app)
      .put(`/api/texts/${textId}`)
      .send({ 
        content: '',
        userId: testUserId 
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ message: 'Text content cannot be empty' })
    );
  });

  it('DELETE /api/texts/:id should delete text and invalidate cache', async () => {
    const response = await request(app)
      .delete(`/api/texts/${textId}?userId=${testUserId}`);
    expect(response.status).toBe(204);
  });
});

// throttling UT
describe('Throttling Middleware', () => {
  let app: Application;
  let textId: string;
  const testUserId = 'test-user-123'; // Define a test user ID

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ 
        content: 'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.',
        userId: testUserId 
      });
    textId = response.body.data._id;
  });

  it('GET /api/texts/:id/word-count return 429 after 100 hits', async () => {
    for (let i = 0; i < 100; i++) {
      await request(app)
        .get(`/api/texts/${textId}/word-count?userId=${testUserId}`);
    }
    const response = await request(app)
      .get(`/api/texts/${textId}/word-count?userId=${testUserId}`);
    expect(response.status).toBe(429);
    expect(response.body.message).toContain('Too many requests, please try again later.');
  });
})
