'user strict'
process.env.SECRET = 'toes';
const supergoose = require('@code-fellows/supergoose');
const server = require('../api-server/src/server.js').server

const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      it('should create user by /signup with no auth', async () => {

        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObj = response.body;

        expect(response.status).toBe(201);
        expect(userObj.token).toBeDefined();
        expect(userObj.user._id).toBeDefined();
        expect(userObj.user.username).toEqual(users[userType].username);

      });

      it('should signin with basic authorization', async () => {

        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const userObj = response.body;
        expect(response.status).toBe(200);
        expect(userObj.token).toBeDefined();
        expect(userObj.user._id).toBeDefined();
        expect(userObj.user.username).toEqual(users[userType].username);

      });

      it('should signin with bearer authorization', async () => {
        const response = await mockRequest
          .post('/signin')
          .auth(users[userType].username, users[userType].password);

        const token = response.body.token;

        const bearerResponse = await mockRequest
          .get('/secret')
          .set('Authorization', `Bearer ${token}`);

        expect(bearerResponse.status).toBe(200);
      });

    });

    describe('invalid logins', () => {
      it('fails with invalid username and correct password   ', async () => {

        const response = await mockRequest.post('/signin')
          .auth('sam', '123');
        const userObj = response.body;

        expect(response.status).toBe(403);
        expect(userObj.user).not.toBeDefined();
        expect(userObj.token).not.toBeDefined();

      });

      it('basic fails with unknown user', async () => {

        const response = await mockRequest.post('/signin')
          .auth('noor', '123');
        const userObj = response.body;

        expect(response.status).toBe(403);
        expect(userObj.user).not.toBeDefined();
        expect(userObj.token).not.toBeDefined();

      });

      it('bearer failure with invalid token', async () => {

        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer foobar`);

        expect(bearerResponse.status).toBe(500);

      });
    });

  });

});


