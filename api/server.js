import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    app.listen(PORT, console.log(`app started on port ${PORT}`));
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();
