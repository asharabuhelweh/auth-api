'use strict';
require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const server = require('../api-server/src/server.js').server
const request = supergoose(server);

describe('server', () => {
  it('should get 404 status', async () => {
    const response = await request.get('/loo');
    expect(response.status).toBe(404);
  });

  
 
  

});
