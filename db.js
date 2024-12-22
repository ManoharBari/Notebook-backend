require("dotenv").config();

const mongoose = require("mongoose");

main()
  .then()
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    // hosting configuration
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = main;
