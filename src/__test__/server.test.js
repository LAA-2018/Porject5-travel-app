const req = require("supertest");
const app = require("../server/server");

    test("Testing the get() function", () => {
        req(app).get("/").then(res => {
            expect(res.status).toBe(200);
            done(); });
    });
