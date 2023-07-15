import app, {myFunc}  from "../index";

import supertest from "supertest";

const request = supertest(app);

// unit test
it("myFunc(5) equal to 25", () => {
  expect(myFunc(5)).toEqual(25);
})


//end point test
fdescribe('Endpoint test sample works', () => {
  it('get the api endpoint', async () => {
    const response = await request.get("/endpoint-test");
    expect(response.status).toBe(200);
  })
})



