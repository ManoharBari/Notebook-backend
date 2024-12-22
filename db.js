require("dotenv").config();

const mongoose = require("mongoose");

main()
  .then()
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://manoharkale5368:YcS2FdrUjxvVnMFr@notebook.golu9.mongodb.net/?retryWrites=true&w=majority&appName=Notebook",
    {
      // hosting configuration
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

module.exports = main;
