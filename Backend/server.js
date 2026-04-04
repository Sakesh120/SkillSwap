import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

app.listen(3000, () => {
  console.log("The server is runnig on  the http://localhost:3000");
});
