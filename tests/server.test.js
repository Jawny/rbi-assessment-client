const axios = require("axios");
// Use for local development
// const updateUrl = "http://localhost:8000/update";
// const readUrl = "http://localhost:8000/";
// const createUrl = "http://localhost:8000/create";
// const deleteUrl = "http://localhost:8000/delete";

const updateUrl = "https://rbi-server.herokuapp.com/update";
const readUrl = "https://rbi-server.herokuapp.com/";
const createUrl = "https://rbi-server.herokuapp.com/create";
const deleteUrl = "https://rbi-server.herokuapp.com/delete";

let documentId;
beforeAll(async () => {
  const data = await axios.post(createUrl);
  documentId = data.data["_id"];
});

afterAll(async () => {
  await axios({ method: "DELETE", url: deleteUrl, data: { id: documentId } });
});

describe("API calls test", () => {
  it("Read data from database and check if _id is equal to documentId and result is equal to expected result", async () => {
    const expectedResult = [0, 0];
    const res = await axios({ method: "GET", url: readUrl });

    // index for scores is offset by one so toBe is not perfectly equal but is serialized to the same string
    expect(res.data[0].scores).toStrictEqual(expectedResult);
    expect(res.data[0]._id).toBe(documentId);
  });

  it("Update data in database", async () => {
    const expectedResult = [15, 0];
    const res = await axios({
      method: "PUT",
      url: updateUrl,
      data: { id: documentId, scores: [15, 0] },
    });

    // index for scores is offset by one so toBe is not perfectly equal but is serialized to the same string
    expect(res.data.scores).toStrictEqual(expectedResult);
  });

  it("Update database and then Read the database", async () => {
    const expectedResult = [15, 15];

    const updateResult = await axios({
      method: "PUT",
      url: updateUrl,
      data: { id: documentId, scores: [15, 15] },
    });

    // index for scores is offset by one so toBe is not perfectly equal but is serialized to the same string
    expect(updateResult.data.scores).toStrictEqual(expectedResult);

    const readResult = await axios({ method: "GET", url: readUrl });

    // index for scores is offset by one so toBe is not perfectly equal but is serialized to the same string
    expect(readResult.data[0].scores).toStrictEqual(expectedResult);
  });
});
