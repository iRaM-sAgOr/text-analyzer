import request from 'supertest';
import mongoose from 'mongoose';
import { Application } from 'express';
import { createApp } from '../src/app';
import 'dotenv/config';

describe('Text API', () => {
  let app: Application;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let textId: string;

  beforeEach(async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ content: 'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.' });
    textId = response.body.data._id;
  });

  it('POST /api/texts should create a text with correct schema', async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ content: 'first one from ikramul' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        _id: expect.any(String),
        content: 'first one from ikramul',
        userId: '10',
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
      },
      message: 'Text created successfully',
    });
  });

  it('POST /api/texts should fail for empty content', async () => {
    const response = await request(app)
      .post('/api/texts')
      .send({ content: '' });
    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ message: 'Text content cannot be empty' })
    );
  });

});