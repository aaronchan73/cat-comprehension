import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('userController tests', () => {
  let req, res;
  let mockDb;

  beforeEach(() => {
    // Initialize mock database
    mockDb = [
      { username: 'gloria', studentId: 123 },
      { username: 'tim', studentId: 456 }
    ];

    // Stub fs.readFileSync to return the mock database
    sinon.stub(fs, 'readFileSync').callsFake((filePath, encoding) => {
      if (encoding === 'utf8') {
        return JSON.stringify(mockDb);
      }
    });

    // Stub fs.writeFileSync to update the mock database
    sinon.stub(fs, 'writeFileSync').callsFake((filePath, data) => {
      mockDb = JSON.parse(data);
    });

    req = {
      body: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('AddStudent', () => {
    it('successfully adds a new student', () => {
      req.body = {
        username: 'newname',
        studentId: '789'
      };

      userController.AddStudent(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(sinon.match({
        message: 'User added successfully',
        user: { username: 'newname', studentId: '789' }
      }))).to.be.true;
      expect(mockDb).to.deep.include({ username: 'newname', studentId: '789' });
    });

    it('returns error if username or studentId is missing', () => {
      req.body = { username: 'missingId' };

      userController.AddStudent(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Username or student ID is required' })).to.be.true;
    });

    it('returns error if username or studentId already exists', () => {
      req.body = {
        username: 'gloria',
        studentId: 123
      };

      userController.AddStudent(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Username or student ID already exists' })).to.be.true;
    });
  });

  

  describe('GetStudents', () => {
    it('returns all registered students', () => {
      userController.GetStudents(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(sinon.match({
        message: 'Users retrieved successfully',
        users: mockDb
      }))).to.be.true;
    });

    it('returns an empty array if no users are present', () => {
      mockDb = []; // Clear the mock database

      userController.GetStudents(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(sinon.match({
        message: 'Users retrieved successfully',
        users: []
      }))).to.be.true;
    });
  });
});