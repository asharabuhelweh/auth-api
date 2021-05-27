'use strict';

require('dotenv').config();

const server = require('../api-server/src/server.js').server;
require('@code-fellows/supergoose');
const supertest = require("supertest");
const request = supertest(server);


let foodObj = {
    name: "orange",
    calories: 20,
    type: "FRUIT"
}

describe("v1 routes", () => {

    it("it should create new food obj and add it at mongodb", async() => {
        let test = await request.post('/api/v1/food').send(foodObj);

        expect(test.body.name).toEqual("orange");
        expect(test.status).toEqual(201);
    });


    it("it should get all food abj in the db", async() => {
        let test = await request.get('/api/v1/food');

        expect(test.body[0].calories).toEqual(20);
        expect(test.status).toEqual(200);
    });



    it("it should get single food abj by id", async() => {
        let test = await request.get('/api/v1/food');
        let id = test.body[0]._id

        let test2 = await request.get(`/api/v1/food/${id}`);

        expect(test2.body.type).toEqual("FRUIT");
        expect(test2.status).toEqual(200);
    });

    it("should update the food object and return the updated obj", async() => {
        let test = await request.get('/api/v1/food');
        let id = test.body[0]._id

        let updatedObj = {
            name: "orange",
            calories: 200,
            type: "FRUIT"
        }

        let updatedTest = await request.put(`/api/v1/food/${id}`).send(updatedObj);

        expect(updatedTest.body.calories).toEqual(200);


        expect(updatedTest.status).toEqual(200);
    });


    it("it should delete an food object by id from db", async() => {
        let test = await request.get('/api/v1/food');
        let id = test.body[0]._id



        let toDelete = await request.delete(`/api/v1/food/${id}`)
        let toGetDeleted = await request.get(`/api/v1/food/${id}`);

        expect(toDelete.body.name).toEqual("orange");
        expect(toDelete.status).toEqual(200);

        expect(toGetDeleted.body).toEqual(null);
    });



});