const mongoose = require("mongoose");

main()
  .then()
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://manoharkale5368:Manohar2004@notebook.golu9.mongodb.net/?retryWrites=true&w=majority&appName=Notebook",
    {
      // hosting configuration
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

module.exports = main;
