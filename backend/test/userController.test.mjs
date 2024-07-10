import chai from 'chai';
import mockFs from 'mock-fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import chaiHttp from 'chai-http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testData = JSON.stringify([]);


  describe ('userController tests', () => {

    beforeEach(() => { 
        mockFs({
            [path.join(__dirname, '../Users.json')] : testData 
        });
    }); 

    afterEach(() => {
        mockFs.restore();
    });

    describe('AddStudent', () => { 
        it('successfully adds new student', () => {
            const req = {
                body: { 
                    username: "gloria", 
                    studentId: "123"
                }
            };

            const res = { 
                status: function (statusCode) {
                    this.statusCode = statusCode; 
                    return this; 
                }, 
                json: function (data) {
                    this.data = data;
                    return this
                }
            };

            userController.AddStudent(req, res); 
            expect(res.statusCode).to.equal(200); 
            expect(res.data).to.have.property('message', 'User added successfully'); 
            expect(res.data.user).to.have.property('username', 'gloria'); 
            expect(res.data.user).to.have.property('studentId', '123');    
        }); 

        it ('returns error if username or studentId is missing', () => {
            const req = {
                body: { 
                    username: 'gloria'
                }
            }; 

            const res = {
                status: function(statusCode) {
                    this.statusCode = statusCode; 
                    return this;
                }, 

                json: function (data) {
                    this.data = data; 
                    return this;
                }, 
            }; 

            userController.AddStudent(req, res); 

            expect(res.statusCode).to.equal(400); 
            expect(res.data).to.have.property('message', 'Username or student ID is required'); 
        });

        it('returns error if username or studentId already exists', () => {

            mockFs({
                [path.join(__dirname, '../Users.json')] : JSON.stringify([
                    {"studentId" : 123, "username": "gloria"}
                ])
            });

            const req = {
                body: {
                    username: 'gloria', 
                    studentId: 123 
                }
            };

            const res = {
                status: function (statusCode) { 
                    this.statusCode = statusCode; 
                    return this; 
                }, 

                json: function(data) { 
                    this.data = data; 
                    return this; 
                }
            }; 

            userController.AddStudent(req, res); 

            expect(res.statusCode).to.equal(400); 
            expect(res.data).to.have.property('message', 'Username or student ID already exists'); 
        }); 
    }); 


    describe('GetStudents', () => {
        it ('returns all registered students', () => {
            mockFs({
                [path.join(__dirname, '../Users.json')]: JSON.stringify([
                    {"studentId": 123, "username": "gloria"}, 
                    {"studentId": 456, "username": "tim"}, 
                ])
            }); 

            const req = {}; 

            const res = {
                status: function (statusCode){
                    this.statusCode = statusCode; 
                    return this;
                },

                json: function(data) { 
                    this.data = data; 
                    return this; 
                }
            }; 

            userController.GetStudents(req, res); 

            expect(res.statusCode).to.equal(200);
            expect(res.data).to.have.property('message', 'Users retrieved successfully');
            expect(res.data.users).to.be.an('array');
            expect(res.data.users).to.have.lengthOf(2);
        }); 

        it('empty array case', () => {

            const req = {};

            const res = {
                status: function (statusCode) {
                    this.statusCode = statusCode;
                    return this;
                },
                json: function (data) {
                    this.data = data;
                    return this;
                }
            };

            userController.GetStudents(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res.data).to.have.property('message', 'Users retrieved successfully');
            expect(res.data.users).to.be.an('array').that.is.empty;
         });
        });
    });
  
