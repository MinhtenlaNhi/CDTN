const dotenv = require("dotenv");
dotenv.config();

const { connectDb } = require("./db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

connectDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
