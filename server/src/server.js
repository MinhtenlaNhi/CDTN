const dotenv = require("dotenv");
const { connectDb } = require("./db");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
