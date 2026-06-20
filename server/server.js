import connectDB from "./src/db/db.js";
import app from "./src/index.js";
import "dotenv/config";

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
  });
};

startServer()
