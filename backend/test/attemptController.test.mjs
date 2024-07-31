import { expect } from "chai";
import sinon from "sinon";
import fs from "fs";
const attemptController = await import("../controllers/attemptController.js");

const {
  readAttemptsJSON,
  readQuestionsJSON,
  updateAttemptsJSON,
  parseCode,
  generateCode,
  readAttemptTestsJSON,
  testAttempt,
  GetAttemptsByUsername,
  AddAttempt,
} = attemptController;

describe("Helper Functions", () => {
  let mockDb;

  beforeEach(() => {
    // Initial mock database
    mockDb = {
      attempts: JSON.stringify([
        {
          username: "test",
          success: true,
          message: "All tests passed",
          attemptId: 1,
          questionId: 2,
          generateCode: "function sum(a, b) { return a + b; }",
          numPassed: 1,
        },
        {
          username: "testUser",
          success: false,
          message: "Tests failed",
          attemptId: "1",
          questionId: "1",
          generateCode:
            "function twoSum(nums, target) { return `${nums[1]}, ${nums[0]}`; }",
          numPassed: 0,
        },
      ]),
      questions: JSON.stringify([
        {
          id: 1,
          name: "Two Sum",
          code: "from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    numToIndex = {}\n    for index, num in enumerate(nums):\n        complement = target - num\n        if complement in numToIndex:\n            return [numToIndex[complement], index]\n        numToIndex[num] = index\n    return []\n\n# Example usage:\nnums = [2, 7, 11, 15]\ntarget = 9\nresult = twoSum(nums, target)\nprint(result)  # Output: [0, 1]\n",
        },
        {
          id: 2,
          name: "Sum Function",
          code: "function add(a, b) { return a + b; }",
        },
      ]),
      attemptTests: JSON.stringify([
        {
          id: 1,
          testCases: [
            {
              input: "1, 2",
              expectedOutput: "3",
              successMessage: "Success",
              errorMessage: "Fail",
            },
          ],
        },
      ]),
    };

    // Stub fs.readFileSync to return the mock database
    sinon.stub(fs, "readFileSync").callsFake((filePath, encoding) => {
      if (encoding === "utf8") {
        if (filePath.includes("Attempts.json")) {
          return mockDb.attempts;
        }
        if (filePath.includes("Questions.json")) {
          return mockDb.questions;
        }
        if (filePath.includes("Attempt-Tests.json")) {
          return mockDb.attemptTests;
        }
      }
    });

    // Stub fs.writeFileSync to update the mock database
    sinon.stub(fs, "writeFileSync").callsFake((filePath, data) => {
      if (filePath.includes("Attempts.json")) {
        mockDb.attempts = data;
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("readAttemptsJSON", () => {
    it("should read and parse Attempts.json", () => {
      const result = readAttemptsJSON();
      expect(result).to.deep.equal(JSON.parse(mockDb.attempts));
    });
  });

  describe("readQuestionsJSON", () => {
    it("should read and parse Questions.json", () => {
      const result = readQuestionsJSON();
      expect(result).to.deep.equal(JSON.parse(mockDb.questions));
    });
  });

  describe("updateAttemptsJSON", () => {
    it("should write data to Attempts.json", () => {
      const fakeData = [{ id: 1 }];
      updateAttemptsJSON(fakeData);
      expect(mockDb.attempts).to.equal(JSON.stringify(fakeData, null, 2));
    });
  });

  describe("parseCode", () => {
    // it("should parse code from the response", () => {
    //   const response = '```javascript\nfunction example() { return "example"; }\n```';
    //   const result = parseCode(response);
    //   expect(result).to.equal('function example() { return "example"; }');
    // });
  
    it("should return an empty string if no code is found", () => {
      const response = "No code here";
      const result = parseCode(response);
      expect(result).to.equal("");
    });
  });

  describe("generateCode", () => {
    it("should generate code based on the description and question", async () => {
      const fetchStub = sinon.stub(global, "fetch").resolves({
        ok: true,
        json: async () => ({ response: "generatedCode" }),
      });

      const result = await generateCode("description", "question");
      expect(result).to.equal("generatedCode");
      fetchStub.restore();
    });

    it("should throw an error if the response is not ok", async () => {
      const fetchStub = sinon.stub(global, "fetch").resolves({
        ok: false,
        status: 500,
      });

      let error;
      try {
        await generateCode("description", "question");
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an("error");
      fetchStub.restore();
    });
  });

  describe("readAttemptTestsJSON", () => {
    it("should read and parse Attempt-Tests.json", () => {
      const result = readAttemptTestsJSON();
      expect(result).to.deep.equal(JSON.parse(mockDb.attemptTests));
    });
  });

  describe("testAttempt", () => {
    it("should test user code against test cases", () => {
      const userCode = "function add(a, b) { return a + b; }";
      const testCases = [
        {
          input: "1, 2",
          expectedOutput: "3",
          successMessage: "Success",
          errorMessage: "Fail",
        },
      ];

      const result = testAttempt(userCode, testCases);
      expect(result).to.deep.equal([
        {
          input: "1, 2",
          expectedOutput: "3",
          actualOutput: 3,
          message: "Success",
          passed: true,
          test: undefined
        },
      ]);
    });

    it("should handle errors in user code", () => {
      const userCode = 'function add(a, b) { throw new Error("error"); }';
      const testCases = [
        {
          input: "1, 2",
          expectedOutput: "3",
          successMessage: "Success",
          errorMessage: "Fail",
        },
      ];

      const result = testAttempt(userCode, testCases);
      expect(result).to.deep.equal([
        {
          input: "1, 2",
          expectedOutput: "3",
          actualOutput: "error",
          message: "Fail",
          passed: false,
          test: undefined
        },
      ]);
    });
  });
});

describe("Controller Functions", () => {
  let req, res;
  let mockDb;

  beforeEach(() => {
    // Initial mock database
    mockDb = {
      attempts: JSON.stringify([
        {
          username: "test",
          success: true,
          message: "All tests passed",
          attemptId: 1,
          questionId: 2,
          generateCode: "function sum(a, b) { return a + b; }",
          numPassed: 1,
        },
        {
          username: "testUser",
          success: false,
          message: "Tests failed",
          attemptId: "1",
          questionId: "1",
          generateCode:
            "function twoSum(nums, target) { return `${nums[1]}, ${nums[0]}`; }",
          numPassed: 0,
        },
      ]),
      questions: JSON.stringify([
        {
          id: 1,
          name: "Two Sum",
          code: "from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    numToIndex = {}\n    for index, num in enumerate(nums):\n        complement = target - num\n        if complement in numToIndex:\n            return [numToIndex[complement], index]\n        numToIndex[num] = index\n    return []\n\n# Example usage:\nnums = [2, 7, 11, 15]\ntarget = 9\nresult = twoSum(nums, target)\nprint(result)  # Output: [0, 1]\n",
        },
        {
          id: 2,
          name: "Sum Function",
          code: "function add(a, b) { return a + b; }",
        },
      ]),
      attemptTests: JSON.stringify([
        {
          id: 1,
          testCases: [
            {
              input: "1, 2",
              expectedOutput: "3",
              successMessage: "Success",
              errorMessage: "Fail",
            },
          ],
        },
      ]),
    };

    // Stub fs.readFileSync to return the mock database
    sinon.stub(fs, "readFileSync").callsFake((filePath, encoding) => {
      if (encoding === "utf8") {
        if (filePath.includes("Attempts.json")) {
          return mockDb.attempts;
        }
        if (filePath.includes("Questions.json")) {
          return mockDb.questions;
        }
        if (filePath.includes("Attempt-Tests.json")) {
          return mockDb.attemptTests;
        }
      }
    });

    // Stub fs.writeFileSync to update the mock database
    sinon.stub(fs, "writeFileSync").callsFake((filePath, data) => {
      if (filePath.includes("Attempts.json")) {
        mockDb.attempts = data;
      }
    });

    req = {
      body: {},
      params: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetAttemptsByUsername", () => {
    it("should return attempts for the given username", () => {
      req.params.username = "testUser";

      GetAttemptsByUsername(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith(
          sinon.match({
            message: "Attempt retrieved successfully",
            userAttempts: sinon.match.array,
          })
        )
      ).to.be.true;
      expect(res.json.args[0][0].userAttempts).to.deep.include({
        username: "testUser",
        success: false,
        message: "Tests failed",
        attemptId: "1",
        questionId: "1",
        generateCode:
          "function twoSum(nums, target) { return `${nums[1]}, ${nums[0]}`; }",
        numPassed: 0,
      });
    });

    it("should return an error if no attempts found for the given username", () => {
      req.params.username = "nonexistentuser";

      GetAttemptsByUsername(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "Attempt not found" })).to.be.true;
    });
  });

  describe("AddAttempt", () => {
    // it('should add a new attempt and return the result', async () => {
    //     req.body = {
    //         username: 'newuser',
    //         description: 'test description',
    //         questionId: 1
    //     };
    //     req.params.attemptId = 2;

    //     const fetchStub = sinon.stub(global, 'fetch').resolves({
    //         ok: true,
    //         json: async () => ({ response: '```javascript\nfunction example() { return "example"; }\n```' })
    //     });

    //     await AddAttempt(req, res);

    //     expect(res.status.calledWith(200)).to.be.true;
    //     expect(res.json.calledWith(sinon.match({
    //         message: 'Tests successfully ran',
    //         result: sinon.match.object
    //     }))).to.be.true;

    //     const newAttempt = {
    //         username: 'newuser',
    //         success: false, // Update expected values to match the actual result
    //         message: 'Tests failed',
    //         attemptId: 2,
    //         questionId: 1,
    //         generateCode: 'function example() { return "example"; }',
    //         numPassed: 0
    //     };

    //     console.log("mockDb.attempts:", JSON.parse(mockDb.attempts));
    //     console.log("newAttempt:", newAttempt);

    //     expect(JSON.parse(mockDb.attempts)).to.deep.include(newAttempt);
    //     fetchStub.restore();
    // });

    it("should return an error if description is missing", async () => {
      req.body = {
        username: "newuser",
        questionId: 1,
      };
      req.params.attemptId = 2;

      await AddAttempt(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "Description is required" })).to.be
        .true;
    });
  });
});
