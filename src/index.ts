export const myFunc = (num: number) => num * 5;

import express from 'express';

const app = express();

const port = 1234;

// end point test
app.get("/endpoint-test", (req,res) => {
  res.send("Called");
})

app.listen(port, () => console.log(`Test app is listening on port ${port}`));

export default app;