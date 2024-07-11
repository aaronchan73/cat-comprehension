import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';

const questionController = await import('../controllers/questionController.js');

const {
    GetQuestions,
    GetQuestionsById
} = questionController;

describe('Question Controller', () => {
    let req, res;
    let mockDb;

    beforeEach(() => {
        // Initial mock database
        mockDb = {
            questions: JSON.stringify([
                {
                    "id": 1,
                    "code": "function add(a, b) { return a + b; }"
                },
                {
                    "id": 2,
                    "code": "function subtract(a, b) { return a - b; }"
                }
            ])
        };

        // Stub fs.readFileSync to return mock database
        sinon.stub(fs, 'readFileSync').callsFake((filePath, encoding) => {
            if (encoding === 'utf8') {
                if (filePath.includes('Questions.json')) {
                    return mockDb.questions;
                }
            }
            return undefined;
        });

        req = {
            params: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GetQuestions', () => {
        it('should return all available questions', () => {
            GetQuestions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                message: 'Questions retrieved successfully',
                questions: sinon.match.array
            }))).to.be.true;

            expect(res.json.args[0][0].questions).to.deep.equal(JSON.parse(mockDb.questions));
        });
    });

    describe('GetQuestionsById', () => {
        it('should return a specific question by ID', () => {
            req.params.id = 1;

            GetQuestionsById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                message: 'Question retrieved successfully',
                question: sinon.match.object
            }))).to.be.true;

            const expectedQuestion = {
                "id": 1,
                "code": "function add(a, b) { return a + b; }"
            };

            expect(res.json.args[0][0].question).to.deep.equal(expectedQuestion);
        });

        it('should return an error if question ID is not found', () => {
            req.params.id = 3;

            GetQuestionsById(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Question not found' })).to.be.true;
        });

        it('should return an error if question ID is not a valid number', () => {
            req.params.id = 'invalid';

            GetQuestionsById(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Question not found' })).to.be.true;
        });
    });
});
