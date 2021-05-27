'use strict';

process.env.SECRET = 'toes';

require('@code-fellows/supergoose');


const middleware = require('../auth-server/src/auth/middleware/bearer.js');

const Users = require('../auth-server/src/auth/models/users.js');
const jwt = require('jsonwebtoken');

let users = {
  admin: { username: 'admin', password: 'password' },
};

beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});

describe('Auth Middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {
    it('fails a login for a user (admin) with an incorrect token', () => {
      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith('Invalid Login');
      });
    });

    it('fails a login for a user (admin) without token', () => {
      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith('Invalid Login');
      });
    });

    

    it('logs in with correct token', () => {
      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };
      

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith();
      });
    });

    
  });

  
});