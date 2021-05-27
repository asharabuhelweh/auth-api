'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const server = require('../api-server/src/server.js').server
const request = supergoose(server);

test('should get a welcome message', async () => {
  const response = await request.get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('welcome in server.js :)');
});

test('wrong method', async () => {
  const response = await request.delete('/signup');
  expect(response.status).toEqual(404);
});

