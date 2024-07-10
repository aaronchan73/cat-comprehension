import { AddAttempt } from "../controllers/attemptController.js";
import { expect } from 'chai';
describe('AddAttempt', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: 'testUser',
                description: 'testDescription',
                questionId: '123'
            },
            params: {
                attemptId: '456'
            }
        };
        res = {
            status: function(statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            json: function(response) {
                this.response = response;
            }
        };
    });

    it('should return 400 if description is missing', async () => {
        req.body.description = '';

        await AddAttempt(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.response).to.deep.equal({ message: 'Description is required' });
    });
})