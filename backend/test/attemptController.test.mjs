
import { expect } from 'chai';
import sinon from 'sinon';
const attemptController = await import('../controllers/attemptController.js');

describe('AddAttempt', () => {
    let req, res, readQuestionsJSONStub, readAttemptTestsJSONStub, generateCodeStub, parseCodeStub, testAttemptStub, readAttemptsJSONStub, updateAttemptsJSONStub;

    beforeEach(() => {
        req = {
            body: {
                username: 'testUser',
                description: 'testDescription',
                questionId: '1'
            },
            params: {
                attemptId: '1'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        readQuestionsJSONStub = sinon.stub().returns([{ id: '123', code: 'someCode' }]);
        readAttemptTestsJSONStub = sinon.stub().returns([{ id: '123', testCases: ['testCase1', 'testCase2'] }]);
        generateCodeStub = sinon.stub().resolves('generatedCode');
        parseCodeStub = sinon.stub().returns('parsedCode');
        testAttemptStub = sinon.stub().returns([{ passed: true }, { passed: false }]);
        readAttemptsJSONStub = sinon.stub().returns([]);
        updateAttemptsJSONStub = sinon.stub();

        // Replace the real functions with stubs
        global.readQuestionsJSON = readQuestionsJSONStub;
        global.readAttemptTestsJSON = readAttemptTestsJSONStub;
        global.generateCode = generateCodeStub;
        global.parseCode = parseCodeStub;
        global.testAttempt = testAttemptStub;
        global.readAttemptsJSON = readAttemptsJSONStub;
        global.updateAttemptsJSON = updateAttemptsJSONStub;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if description is missing', async () => {
        req.body.description = '';

        await attemptController.AddAttempt(req, res);
        console.log(res)
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Description is required' })).to.be.true;
    });

    it('should return 400 if code generation fails', async () => {
        generateCodeStub.resolves(undefined);

        await attemptController.AddAttempt(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Error generating code from Ollama' })).to.be.true;
    });

    it('should return 200 and the result if successful', async () => {
        await attemptController.AddAttempt(req, res)
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            message: 'Tests successfully ran',
            result: {
                username: 'testUser',
                success: true,
                message: 'All tests passed',
                attemptId: '1',
                questionId: '1',
                generateCode: 'parsedCode',
                numPassed: 1
            }
        })).to.be.true;
    });

    it('should handle internal server error', async () => {
        generateCodeStub.rejects(new Error('Some error'));

        await attemptController.AddAttempt(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Internal server error' })).to.be.true;
    });
});
