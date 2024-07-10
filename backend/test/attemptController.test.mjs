import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
const attemptController = await import('../controllers/attemptController.js');
import path from 'path';
const __dirname = path.resolve();
const {
    readAttemptsJSON,
    readQuestionsJSON,
    updateAttemptsJSON,
    parseCode,
    generateCode,
    readAttemptTestsJSON,
    testAttempt,
    GetAttemptsByUsername,
    AddAttempt

} = attemptController;

describe('Helper Functions', () => {

    afterEach(() => {
        sinon.restore();
    });

    describe('readAttemptsJSON', () => {
        it('should read and parse Attempts.json', () => {
            const fakeData = '[{"id":1}]';
            sinon.stub(fs, 'readFileSync').returns(fakeData);

            const result = readAttemptsJSON();
            expect(result).to.deep.equal([{ id: 1 }]);
        });
    });

    describe('readQuestionsJSON', () => {
        it('should read and parse Questions.json', () => {
            const fakeData = '[{"id":1, "code":"someCode"}]';
            sinon.stub(fs, 'readFileSync').returns(fakeData);

            const result = readQuestionsJSON();
            expect(result).to.deep.equal([{ id: 1, code: 'someCode' }]);
        });
    });

    describe('updateAttemptsJSON', () => {
        it('should write data to Attempts.json', () => {
            const fakeData = [{ id: 1 }];
            const writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

            updateAttemptsJSON(fakeData);
            expect(writeFileSyncStub.calledOnce).to.be.true;
            expect(writeFileSyncStub.calledWith(sinon.match.string, JSON.stringify(fakeData, null, 2), 'utf8')).to.be.true;
        });
    });

    describe('parseCode', () => {
        it('should parse code from the response', () => {
            const response = '```javascript\nconst code = "example";\n```';
            const result = parseCode(response);
            expect(result).to.equal('const code = "example";');
        });

        it('should return an empty string if no code is found', () => {
            const response = 'No code here';
            const result = parseCode(response);
            expect(result).to.equal('');
        });
    });

    describe('generateCode', () => {
        it('should generate code based on the description and question', async () => {
            const fetchStub = sinon.stub(global, 'fetch').resolves({
                ok: true,
                json: async () => ({ response: 'generatedCode' })
            });

            const result = await generateCode('description', 'question');
            expect(result).to.equal('generatedCode');
            fetchStub.restore();
        });

        it('should throw an error if the response is not ok', async () => {
            const fetchStub = sinon.stub(global, 'fetch').resolves({
                ok: false,
                status: 500
            });

            let error;
            try {
                await generateCode('description', 'question');
            } catch (err) {
                error = err;
            }
            expect(error).to.be.an('error');
            fetchStub.restore();
        });
    });

    describe('readAttemptTestsJSON', () => {
        it('should read and parse Attempt-Tests.json', () => {
            const fakeData = '[{"id":1, "testCases": []}]';
            sinon.stub(fs, 'readFileSync').returns(fakeData);

            const result = readAttemptTestsJSON();
            expect(result).to.deep.equal([{ id: 1, testCases: [] }]);
        });
    });

    describe('testAttempt', () => {
        it('should test user code against test cases', () => {
            const userCode = 'function add(a, b) { return a + b; }';
            const testCases = [
                { input: '1, 2', expectedOutput: '3', successMessage: 'Success', errorMessage: 'Fail' },
                { input: '2, 2', expectedOutput: '4', successMessage: 'Success', errorMessage: 'Fail' }
            ];

            const result = testAttempt(userCode, testCases);
            expect(result).to.deep.equal([
                { input: '1, 2', expectedOutput: '3', actualOutput: 3, message: 'Success', passed: true },
                { input: '2, 2', expectedOutput: '4', actualOutput: 4, message: 'Success', passed: true }
            ]);
        });

        it('should handle errors in user code', () => {
            const userCode = 'function add(a, b) { throw new Error("error"); }';
            const testCases = [
                { input: '1, 2', expectedOutput: '3', successMessage: 'Success', errorMessage: 'Fail' }
            ];

            const result = testAttempt(userCode, testCases);
            expect(result).to.deep.equal([
                { input: '1, 2', expectedOutput: '3', actualOutput: 'error', message: 'Fail', passed: false }
            ]);
        });
    });
});


describe('GetAttemptsByUsername', () => {
    let req, res;
  
    beforeEach(() => {
      req = { params: { username: 'testuser' } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      sinon.stub(fs, 'readFileSync');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it.only('should return attempts for the given username', () => {
      const attempts = [{ "username": 'testuser', "attemptId": 1 }];
      fs.readFileSync.withArgs(path.join(__dirname, '../Attempts.json')).returns(JSON.stringify(attempts));
    
      GetAttemptsByUsername(req, res);
      console.log(GetAttemptsByUsername)
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(sinon.match({ message: 'Attempt retrieved successfully', userAttempts: attempts }))).to.be.true;
    });
  
    it('should return 400 if no attempts found for the given username', () => {
      const attempts = [{ username: 'testUser', attemptId: 1 }];
      fs.readFileSync.withArgs(path.join(__dirname, '../Attempts.json')).returns(JSON.stringify(attempts));
  
      GetAttemptsByUsername(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match({ message: 'Attempt not found' }))).to.be.true;
    });
  });