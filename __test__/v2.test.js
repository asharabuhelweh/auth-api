'use strict';

require('dotenv').config();

const server = require('../api-server/src/server.js').server;
require('@code-fellows/supergoose');

const supertest = require("supertest")
const request = supertest(server);


let clothes = {
    name: "dress",
    color: "red",
    size: "small"
}
let user = {
    username: "ashar",
    password: "123",
    role: "admin"
}

describe("V2 routes", () => {
    it(" create permissions with  bearer token to add in the db and return the added objects", async() => {

        let siginUp = await request.post('/signup').send(user);
        let siginIn = await request.post('/signin').auth(user.username, user.password);

        let token = ` Bearer ${siginIn.body.token}`;


        let test = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);


        expect(test.body.color).toEqual("red");
        expect(test.status).toEqual(201);
    });


    it(" create permissions with  bearer token to read and return  the list of objects in db", async() => {

        let siginIn = await request.post('/signin').auth(user.username, user.password);

        let token = `Bearer ${siginIn.body.token}`
        let test = await request.get('/api/v2/clothes').set(`Authorization`, token)


        expect(test.body[0].name).toEqual("dress");
        expect(test.status).toEqual(200);
    });


    it("create permissions with  bearer token to read and return single obj by it id", async() => {

        let siginIn = await request.post('/signin').auth(user.username, user.password);

        let token = `Bearer ${siginIn.body.token}`

        let post = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);

        let id = post.body._id

        let testId = await request.get(`/api/v2/clothes/${id}`).set(`Authorization`, token);

        expect(testId.status).toEqual(200);
        expect(testId.text).toBeDefined();;
    });


    it("create permissions with  bearer token to update and return the updated obj by it id", async() => {

        let siginIn = await request.post('/signin').auth(user.username, user.password);

        let token = `Bearer ${siginIn.body.token}`

        let post = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
        let id = post.body._id

        let updated = {
            name: "dress",
            color: "red",
            size: "large"
        }

        let updateObj = await request.put(`/api/v2/clothes/${id}`).set(`Authorization`, token).send(updated);


        expect(updateObj.status).toEqual(200);
        expect(updateObj.body.size).toEqual("large");;
    });


    it("create permissions with  bearer token to delete specific object by it id", async() => {

        let siginIn = await request.post('/signin').auth(user.username, user.password);

        let token = `Bearer ${siginIn.body.token}`

        let post = await request.post('/api/v2/clothes').set(`Authorization`, token).send(clothes);
        let id = post.body._id



        let deleteObj = await request.delete(`/api/v2/clothes/${id}`).set(`Authorization`, token);
        let testId = await request.get(`/api/v2/clothes/${id}`).set(`Authorization`, token);


        expect(deleteObj.status).toEqual(200);
        expect(deleteObj.data).not.toBeDefined();
        expect(testId.body).toBeNull();

    });
})